import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      // PNG optimization
      png: {
        quality: 80,
      },
      // JPEG optimization
      jpeg: {
        quality: 80,
      },
      // JPG optimization
      jpg: {
        quality: 80,
      },
      // SVG optimization
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      // Generate WebP versions
      webp: {
        quality: 80,
      },
    }),
    Sitemap({
      hostname: 'https://vidacure.se',
      dynamicRoutes: [
        '/',
        '/aboutus',
        '/article/what-is-obesity',
        '/article/treating-obesity',
        '/article/women-health-obesity'
      ],
      exclude: [
        '/login',
        '/admin/*',
        '/dashboard/*',
        '/appointments',
        '/prescriptions',
        '/progress',
        '/resources',
        '/account',
        '/chat',
        '/bmi-check',
        '/onboarding',
        '/subscription/success'
      ],
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/dashboard', '/login']
        }
      ],
      outDir: 'dist',
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'ec2-16-16-213-232.eu-north-1.compute.amazonaws.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'vidacure.se',
      'www.vidacure.se',
      'www.vidacure.eu',
      'vidacure.eu'
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})