# Configuración de reCAPTCHA v3

Para completar la configuración del formulario de contacto con protección anti-spam, necesitas obtener las claves de Google reCAPTCHA v3.

## Pasos para obtener las claves de reCAPTCHA

1. **Ve a la Consola de Administración de Google reCAPTCHA**
   - Visita: <https://www.google.com/recaptcha/admin/create>

2. **Crea un nuevo sitio**
   - **Etiqueta**: Nombre de tu sitio (ej: "Mi Portafolio")
   - **Tipo de reCAPTCHA**: Selecciona "reCAPTCHA v3"
   - **Dominios**: Agrega los dominios donde usarás reCAPTCHA:
     - `localhost` (para desarrollo)
     - Tu dominio de producción (ej: `tudominio.com`)

3. **Obtén las claves**
   - **Clave del Sitio**: Esta es pública, se incluye en el frontend
   - **Clave Secreta**: Esta es privada, se usa en el backend (Getform.io la manejará)

4. **Configurar variables de entorno**

   ```bash
   # En tu archivo .env
   VITE_RECAPTCHA_SITE_KEY=tu_site_key_aqui
   ```

## Configuración en Getform.io

Si usas Getform.io, también debes:

1. Ir a tu formulario en Getform.io
2. En "Settings" → "Spam Protection"
3. Habilitar "Google reCAPTCHA"
4. Pegar tu **Clave Secreta** de reCAPTCHA

## Verificación

Una vez configurado, el formulario:

- ✅ Ejecutará reCAPTCHA automáticamente al enviar
- ✅ Será invisible para usuarios legítimos
- ✅ Bloqueará bots y spam
- ✅ Funcionará sin reCAPTCHA si no está configurado (respaldo elegante)

## Respaldo sin reCAPTCHA

Si no configuras reCAPTCHA, el formulario seguirá funcionando con:

- ✅ Validación Zod
- ✅ Sanitización DOMPurify
- ✅ Detección de patrones sospechosos
- ✅ Limitación de velocidad básica del navegador
