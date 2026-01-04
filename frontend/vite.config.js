import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Kita set port default ke 3000 agar mirip CRA
  },
  preview: {
    allowedHosts: true, 
    host: true, // Ini penting agar bisa diakses dari luar container
    port: 4173  // Port default preview vite
  },
  server: {
    host: true // Ini untuk mode dev local
  }
})