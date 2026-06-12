// Static prerender (SSG) for Vidacure's PUBLIC marketing pages.
//
// Why: the app is a Vite SPA, so without this AI crawlers (and JS-less bots)
// only see an empty #root shell. This step runs the *already-built* SPA in a
// headless browser, lets React + the router render each public route, and saves
// the fully-rendered HTML (including react-helmet meta + JSON-LD) to disk.
//
// Output stays static files, so the existing `serve -s dist` deploy is unchanged.
// Run AFTER `vite build` (wired into the npm "build" script).

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Public routes to snapshot (Swedish at root, English under /en).
const ROUTES = [
  '/',
  '/aboutus',
  '/privacy',
  '/article/what-is-obesity',
  '/article/treating-obesity',
  '/article/women-health-obesity',
  '/article/nutrition-obesity',
  '/article/exercise-obesity',
  '/article/semaglutide-vs-tirzepatide',
  '/en',
  '/en/aboutus',
  '/en/privacy',
  '/en/article/what-is-obesity',
  '/en/article/treating-obesity',
  '/en/article/women-health-obesity',
  '/en/article/nutrition-obesity',
  '/en/article/exercise-obesity',
  '/en/article/semaglutide-vs-tirzepatide',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error(`dist/index.html not found — run "vite build" before prerendering.`);
  }

  // Keep the ORIGINAL SPA shell in memory so it's always served as the SPA
  // fallback, even after we overwrite dist/index.html with the prerendered home.
  const shellHtml = await readFile(join(DIST, 'index.html'));

  // Minimal static server: real files win; unmatched navigations fall back to
  // the in-memory SPA shell so the client router can render the route.
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const ext = extname(urlPath);

      if (ext) {
        const filePath = join(DIST, urlPath);
        if (existsSync(filePath) && (await stat(filePath)).isFile()) {
          res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
          res.end(await readFile(filePath));
          return;
        }
        res.writeHead(404).end('Not found');
        return;
      }

      // Navigation request -> always the original shell.
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(shellHtml);
    } catch (err) {
      res.writeHead(500).end(String(err));
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let ok = 0;
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });

      // Wait until React has rendered real content into #root.
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return !!root && root.innerText.trim().length > 300;
        },
        { timeout: 20000 }
      );

      const html = await page.content();
      await page.close();

      const outPath =
        route === '/'
          ? join(DIST, 'index.html')
          : join(DIST, route, 'index.html');
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf8');

      // Sanity: the snapshot must contain JSON-LD, otherwise it's an empty shell.
      const hasLd = html.includes('application/ld+json');
      console.log(`  ✓ ${route.padEnd(36)} -> ${outPath.replace(DIST + '/', 'dist/')}${hasLd ? '' : '  ⚠ no JSON-LD'}`);
      ok += 1;
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\nPrerendered ${ok}/${ROUTES.length} routes.`);
  if (ok !== ROUTES.length) process.exit(1);
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
