# Deployment en Vercel - Configuración de Variables de Entorno

## 🚀 Pasos para Desplegar en Vercel

### 1. Configuración de Variables de Entorno en Vercel

Accede a tu proyecto en Vercel Dashboard y ve a **Settings > Environment Variables**. Agrega las siguientes variables:

#### Variables Requeridas

```bash
# GitHub Configuration
VITE_GITHUB_USERNAME=tu_usuario_github
VITE_GITHUB_TOKEN=tu_token_personal_github

# Contact Form 
VITE_GETFORM_ID=tu_id_getform

# ReCAPTCHA (opcional)
VITE_RECAPTCHA_SITE_KEY=tu_site_key_recaptcha

# Social Media
VITE_LINKEDIN_USERNAME=tu_usuario_linkedin
```

#### Variables Opcionales

```bash
# API personalizada (opcional)
VITE_API_URL=tu_url_api
```

### 2. Obtener Tokens y Configuraciones

#### GitHub Token

1. Ve a GitHub Settings > Developer settings > Personal access tokens
2. Genera un nuevo token con permisos de `public_repo`
3. Copia el token y úsalo como `VITE_GITHUB_TOKEN`

#### GetForm ID

1. Registrate en [getform.io](https://getform.io)
2. Crea un nuevo formulario
3. Copia el ID del endpoint
4. Úsalo como `VITE_GETFORM_ID`

#### ReCAPTCHA (opcional)

1. Ve a [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Registra tu sitio para reCAPTCHA v3
3. Copia la Site Key
4. Úsala como `VITE_RECAPTCHA_SITE_KEY`

### 3. Configuración en Vercel Dashboard

Para cada variable de entorno:

1. **Name**: Nombre de la variable (ej: `VITE_GITHUB_USERNAME`)
2. **Value**: El valor de la variable
3. **Environment**: Selecciona `Production`, `Preview`, y `Development`
4. Click **Add**

### 4. Comandos de Build

El proyecto está configurado para usar:

- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 5. Estructura de Archivos

```text
proyecto/
├── vercel.json          # Configuración de Vercel
├── .env.example         # Ejemplo de variables de entorno
├── tsconfig.app.json    # Config TypeScript para producción
└── tsconfig.test.json   # Config TypeScript para tests
```

### 6. Verificación

Después del deployment, verifica que:

- ✅ El sitio carga correctamente
- ✅ Los proyectos de GitHub se muestran
- ✅ El formulario de contacto funciona
- ✅ No hay errores en la consola

### 7. Troubleshooting

#### Error: "Property 'env' does not exist on type 'ImportMeta'"

- Asegúrate de que `src/vite-env.d.ts` esté incluido en tu build
- Verifica que las variables estén configuradas en Vercel

#### Error: TypeScript compilation issues

- El proyecto usa `tsconfig.app.json` para production builds
- Los archivos de test están excluidos del build de producción

#### Variables de entorno no definidas

- Verifica que las variables estén configuradas en Vercel Dashboard
- Asegúrate de que empiecen con `VITE_`
- Redespliega después de agregar variables

### 8. Valores por Defecto

El código incluye valores por defecto para desarrollo:

- `VITE_GITHUB_USERNAME`: 'mddiosc'
- `VITE_LINKEDIN_USERNAME`: 'miguel-angel-de-dios-calles'

Estos se sobrescriben con las variables de entorno en producción.
