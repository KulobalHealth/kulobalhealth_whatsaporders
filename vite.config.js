import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base URL for deployment (use '/' for root or '/subdirectory/' for subdirectory)
  base: '/',
  server: {
    port: 4000,
    strictPort: true,
    proxy: {
      '/api/v1': {
        target: 'https://kulobalhealth-backend-1.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for debugging (set to false to reduce bundle size)
    sourcemap: false,
    // Use esbuild for minification (faster and included by default)
    minify: 'esbuild',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@heroui/react', '@heroui/theme', 'framer-motion']
        }
      }
    }
  },
  // Esbuild options for production
  esbuild: {
    drop: ['console', 'debugger'] // Remove console.log and debugger in production
  },
  // Preview server configuration (for testing production build locally)
  preview: {
    port: 4000,
    strictPort: true
  }
})
