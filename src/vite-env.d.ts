/// <reference types="vite/client" />

// vite/client types unknown keys on import.meta.env as `any`. Naming the one this
// page reads keeps it a string, and keeps `any` out of the codebase.
interface ImportMetaEnv {
  readonly VITE_SUBPAGE?: string
}
