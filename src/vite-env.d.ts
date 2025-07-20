/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_GITHUB_TOKEN?: string
  readonly VITE_GITHUB_USERNAME?: string
  readonly VITE_GETFORM_ID?: string
  readonly VITE_RECAPTCHA_SITE_KEY?: string
  readonly VITE_LINKEDIN_USERNAME?: string
  readonly VITE_GRAFANA_FARO_URL?: string
  readonly VITE_GRAFANA_FARO_API_KEY?: string
  readonly VITE_GRAFANA_FARO_ENDPOINT?: string
  readonly VITE_GRAFANA_FARO_APP_ID?: string
  readonly VITE_GRAFANA_FARO_STACK_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
