import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://two123110291-tranvanluan.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/images': {
        target: 'https://two123110291-tranvanluan.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
