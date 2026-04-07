import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Toujours des URLs `/assets/...` : évite le MIME `text/html` si l’URL document
  // n’est pas exactement `/` (refresh sur route, proxy, etc.).
  base: '/',
})
