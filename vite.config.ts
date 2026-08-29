import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset URLs, so the same build serves correctly from the domain root
// (https://sign.anyserver.site) without baking a path prefix into every URL.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')

  // The CTA target lives in the environment, never in the repository. Without it the
  // page would render three buttons that go nowhere — and because Button takes an
  // optional href, that failure is silent: no error, no broken link, just dead
  // controls. So it is caught here, where it is loud.
  if (!env.VITE_SUBPAGE?.trim()) {
    throw new Error(
      'VITE_SUBPAGE is not set.\n' +
        '  local   cp .env.example .env, then fill it in\n' +
        '  docker  --build-arg VITE_SUBPAGE=...\n' +
        '  CI      a build-time variable; a runtime one is read too late\n' +
        'It is the URL every call to action opens, and Vite inlines it at build time.',
    )
  }

  return {
    base: './',
    plugins: [react()],
  }
})
