import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset URLs, so the same build serves correctly from the domain root
// (https://sign.anyserver.site) without baking a path prefix into every URL.
export default defineConfig({
  base: './',
  plugins: [react()],
})
