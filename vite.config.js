import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for deployment - change if needed for your hosting platform
  base: './',
  server: {
    // Development server settings
    port: 3000,
    open: true
  },
  build: {
    // Production build settings
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    // You can add environment-specific settings here
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
