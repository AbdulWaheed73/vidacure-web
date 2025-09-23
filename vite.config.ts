import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'ec2-16-16-213-232.eu-north-1.compute.amazonaws.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'vidacure.se',
    ]
  }  ,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})