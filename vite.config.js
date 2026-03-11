import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  build: {
    // Target Chromium 53+ (webOS 2018) — most restrictive
    target: 'es2015',
    // Single chunk for faster load on TV (fewer HTTP requests)
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Keep bundle in single file where possible
        manualChunks: undefined,
      },
    },
    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@sdk': '/src/services/sdk/src',
    },
  },
  server: {
    // Dev on local network to test on real TV
    host: true,
    port: 5173,
  },
})
