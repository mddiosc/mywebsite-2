# Configuración de Grafana Faro

Este documento te guía a través del proceso de configuración de Grafana Faro para observabilidad frontend en la aplicación React.

## ¿Qué es Grafana Faro?

Grafana Faro es un SDK de observabilidad frontend que captura automáticamente:

- **Errores de JavaScript** y excepciones no manejadas
- **Web Vitals** (Core Web Vitals, LCP, FID, CLS)
- **Navegación y rendimiento** de la aplicación
- **Logs personalizados** y eventos de usuario
- **Trazas distribuidas** para tracking de peticiones

## Configuración Paso a Paso

### 1. Crear Cuenta de Grafana Cloud (Gratuito)

1. Ve a [Grafana Cloud](https://grafana.com/auth/sign-up/create-user)
2. Crea una cuenta gratuita (incluye 10k series métricas, 50GB logs, 50GB trazas)
3. Una vez logueado, serás redirigido a tu instancia de Grafana Cloud

### 2. Configurar Frontend Observability

1. En el panel de Grafana Cloud, busca **"Frontend Observability"** o **"Faro"**
2. Haz clic en **"Configure"** o **"Add Frontend App"**
3. Completa la configuración:
   - **App Name**: `mywebsite2` (o el nombre que prefieras)
   - **Environment**: `production` para producción, `development` para desarrollo
4. Copia las credenciales generadas

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` (o edita tu `.env` existente) con:

```bash
# Configuración de Grafana Faro
VITE_GRAFANA_FARO_URL=https://faro-collector-prod-[REGION].grafana.net/collect/[TU_INSTANCIA_ID]
VITE_GRAFANA_FARO_API_KEY=tu_api_key_aqui

# Configuración para subida de source maps (opcional pero recomendado)
VITE_GRAFANA_FARO_ENDPOINT=https://faro-api-prod-[REGION].grafana.net/faro/api/v1
VITE_GRAFANA_FARO_APP_ID=tu_app_id_aqui
VITE_GRAFANA_FARO_STACK_ID=tu_stack_id_aqui
```

**Importante**: Reemplaza `[REGION]`, `[TU_INSTANCIA_ID]`, y otros valores con los datos reales proporcionados por Grafana Cloud.

### 4. Variables de Entorno para Diferentes Ambientes

#### Desarrollo Local

```bash
# Solo habilitar si quieres telemetría en desarrollo
VITE_GRAFANA_FARO_URL=tu_url_de_faro
```

#### Producción (Vercel)

En tu dashboard de Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega:
   - `VITE_GRAFANA_FARO_URL`: tu URL de Faro
   - `VITE_GRAFANA_FARO_API_KEY`: tu API key (opcional)

## Funcionalidades Implementadas

### Integración Completa con React

- ✅ **SDK de React**: Usando `@grafana/faro-react` para integración específica con React
- ✅ **ReactIntegration**: Captura automática de errores de componentes React
- ✅ **Tracking de Navegación**: Hook personalizado para trackear cambios de rutas
- ✅ **Instrumentación Web**: Captura automática de Web Vitals y métricas de rendimiento
- ✅ **Trazado Distribuido**: Para seguimiento de peticiones HTTP
- ✅ **Source Maps**: Subida automática para stack traces legibles en producción

### Inicialización Automática

El SDK se inicializa automáticamente en `src/main.tsx` y:

- ✅ Solo se activa en producción por defecto
- ✅ Captura errores de React automáticamente
- ✅ Registra Web Vitals
- ✅ Incluye trazado distribuido
- ✅ Trackea sesiones de usuario
- ✅ Integración completa con React Router para navegación
- ✅ Subida automática de source maps en builds de producción

### Tracking de Navegación

En `src/components/Layout.tsx` se implementó el hook `useFaroPageTracking()` que:

- ✅ Trackea automáticamente todos los cambios de ruta
- ✅ Captura información del idioma de la página
- ✅ Registra referrer y user agent
- ✅ Incluye parámetros de búsqueda y hash

### Logging Personalizado

Usa el hook `useFaroLogger` en tus componentes:

```tsx
import { useFaroLogger } from '../lib/faro'

const MyComponent = () => {
  const { logEvent, logError, logMeasurement } = useFaroLogger()

  const handleUserAction = () => {
    logEvent('button_clicked', { 
      buttonType: 'submit',
      page: 'contact' 
    })
  }

  const handleError = (error: Error) => {
    logError(error, { 
      context: 'form_validation',
      userId: user.id 
    })
  }

  return <button onClick={handleUserAction}>Click me</button>
}
```

### Ejemplo de Implementación

Ya implementado en `src/pages/Contact/hooks/useContactForm.ts`:

- ✅ Tracking de envíos de formulario
- ✅ Logging de errores de reCAPTCHA
- ✅ Métricas de éxito/fallo
- ✅ Contexto personalizado para debugging

## Configuración de Source Maps

### ¿Qué son los Source Maps?

Los source maps permiten ver el código original (no minificado) en los stack traces de errores en Grafana Faro, facilitando enormemente el debugging en producción.

### Configuración Automática

La aplicación está configurada para:

- ✅ **Generar source maps** automáticamente en builds de producción
- ✅ **Subir source maps** a Grafana Cloud cuando las variables estén configuradas
- ✅ **Comprimir source maps** con gzip para transfer más rápido

### Variables Requeridas para Source Maps

Para habilitar la subida de source maps, configura estas variables adicionales:

```bash
VITE_GRAFANA_FARO_ENDPOINT=https://faro-api-prod-[REGION].grafana.net/faro/api/v1
VITE_GRAFANA_FARO_APP_ID=tu_app_id
VITE_GRAFANA_FARO_STACK_ID=tu_stack_id
```

**Nota**: Estas variables se obtienen desde el panel de Grafana Cloud en la sección de Frontend Observability.

## Dashboards y Alertas

### Dashboards Predeterminados

Grafana Cloud incluye dashboards predeterminados para:

- **Frontend Overview**: Métricas generales de rendimiento
- **Web Vitals**: Core Web Vitals y métricas UX
- **Error Tracking**: Errores JavaScript y stack traces
- **User Sessions**: Análisis de sesiones y navegación

### Crear Alertas

1. En Grafana Cloud, ve a **Alerting** → **Alert Rules**
2. Ejemplos de alertas útiles:
   - Error rate > 5% en 5 minutos
   - Core Web Vitals por debajo de umbrales
   - Tiempo de carga > 3 segundos

## Mejores Prácticas

### 1. Sampling en Producción

Para controlar costos, la configuración actual usa sampling:

```typescript
sampling: {
  traces: 0.1, // 10% de las trazas
  logs: 1.0,   // 100% de los logs
}
```

### 2. Datos Sensibles

- ❌ **NO** logues información personal (emails, passwords)
- ❌ **NO** incluyas datos de tarjetas de crédito
- ✅ **SÍ** usa contexto general (tipo de error, página, acción)

### 3. Performance

- El SDK es ligero (~20KB gzipped)
- Inicialización asíncrona no bloquea la UI
- Sampling controla el volumen de datos

## Troubleshooting

### Faro no se inicializa

1. Verifica que las variables de entorno estén configuradas
2. Revisa la consola del navegador para errores
3. Confirma que estés en modo producción o tengas `VITE_GRAFANA_FARO_URL` en desarrollo

### No veo datos en Grafana

1. Espera 1-2 minutos para la propagación de datos
2. Verifica que el endpoint de Faro sea correcto
3. Revisa las limitaciones del tier gratuito

### Errores de CORS

Si ves errores de CORS, verifica que:

- El endpoint de Faro sea correcto
- No haya proxies o firewalls bloqueando la conexión

## Límites del Tier Gratuito

Grafana Cloud gratuito incluye:

- **10,000 series métricas** por mes
- **50 GB logs** por mes
- **50 GB trazas** por mes
- **Retención**: 30 días para métricas, 15 días para logs/trazas

Para sitios web pequeños a medianos, esto es más que suficiente.

## Enlaces Útiles

- [Documentación oficial de Grafana Faro](https://grafana.com/docs/grafana-cloud/frontend-observability/)
- [Grafana Cloud Dashboard](https://grafana.com/auth/sign-in)
- [Ejemplos de implementación](https://github.com/grafana/faro-web-sdk/tree/main/examples)
