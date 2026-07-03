import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  // react-draggable (via react-rnd) reads process.env at runtime; the browser has no `process`
  define: {
    'process.env': {},
  },
})
