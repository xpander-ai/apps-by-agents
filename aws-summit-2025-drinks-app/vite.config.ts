import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/aws-summit-2025-drinks-app/',
  plugins: [react()],
})
