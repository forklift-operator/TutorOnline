import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows access from external devices
    allowedHosts: ['2ae4-2001-67c-20d0-aac-54c7-b760-1c72-a2c7.ngrok-free.app', '94f6-2001-67c-20d0-aac-54c7-b760-1c72-a2c7.ngrok-free.app']
  }
})
