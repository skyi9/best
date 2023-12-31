import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Change this URL to match your backend API
    },
  },
  define: {
    'process.env.DISABLE_VUE_DEVTOOLS': 'true', // Disable Vue Devtools warnings
  },
})
