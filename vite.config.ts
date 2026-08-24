import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0) for local network/phone access
    port: 5173,
  },
})
