/// <reference types="vite/client" />

// Required, not optional: vite.config.ts refuses to build without it, so by the time
// any of this runs the value exists. Typing it optional would only invite a fallback
// back into the source, which is the thing being kept out.
interface ImportMetaEnv {
  readonly VITE_SUBPAGE: string
}
