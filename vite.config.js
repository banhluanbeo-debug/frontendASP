import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10000', // Đổi sang Localhost API của backend ASP.NET
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://localhost:10000', // Proxy luôn thư mục ảnh về Backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
