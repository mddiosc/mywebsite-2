/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string
  readonly VITE_GITHUB_USERNAME: string
  readonly VITE_GETFORM_ID: string
  readonly VITE_RECAPTCHA_SITE_KEY: string
  readonly VITE_LINKEDIN_USERNAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
