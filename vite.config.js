import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [react(), viteCompression({ algorithm: 'brotliCompress' }), viteCompression({ algorithm: 'gzip' })],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
  optimizeDeps: {
    exclude: ['process'],
  },
  server: {
    host: '0.0.0.0',
  },
})
