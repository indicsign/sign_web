import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The page deploys to https://gamepeg.com/full/indicai/, so the built asset URLs
// must carry that prefix. Local dev serves from the root instead, otherwise every
// dev URL is buried under a path the dev server is the only thing not to need.
// `preview` keeps the deploy prefix because it serves the real build.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/full/indicai/' : '/',
  plugins: [react()],
}))
