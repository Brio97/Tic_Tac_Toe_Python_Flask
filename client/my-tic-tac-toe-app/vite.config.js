import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // The port Vite will run on
    proxy: {
      // Proxy API requests to Flask backend
      '/api': {
        target: 'http://localhost:5000', // Flask backend running on port 5000
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
