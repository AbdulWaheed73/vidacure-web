// ecosystem.config.js
//
// Uses `sirv --single` (not `serve -s`): sirv serves the real file first and
// only falls back to index.html when no file matches. This is required so the
// prerendered public pages (dist/aboutus/index.html, dist/en/article/.../index.html,
// etc.) are served to crawlers, while app routes (/dashboard, /login…) still
// fall back to the SPA shell. `serve -s` rewrites EVERY route to index.html and
// would hide the prerendered pages.
export const apps = [{
  name: 'vidacure-web',
  script: 'sirv',
  args: 'dist --single --host 0.0.0.0 --port 5173',
  env_production: {
    NODE_ENV: 'production'
  }
}];
