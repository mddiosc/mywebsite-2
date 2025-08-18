# reCAPTCHA v3 Configuration

To complete the contact form setup with anti-spam protection, you need to obtain Google reCAPTCHA v3 keys.

## Steps to get reCAPTCHA keys

1. **Go to Google reCAPTCHA Admin Console**
   - Visit: <https://www.google.com/recaptcha/admin/create>

2. **Create a new site**
   - **Label**: Your site name (e.g., "My Portfolio")
   - **reCAPTCHA type**: Select "reCAPTCHA v3"
   - **Domains**: Add the domains where you'll use reCAPTCHA:
     - `localhost` (for development)
     - Your production domain (e.g., `yourdomain.com`)

3. **Get the keys**
   - **Site Key**: This is public, included in the frontend
   - **Secret Key**: This is private, used in the backend (Formspree.io will handle it)

4. **Configure environment variables**

   ```bash
   # In your .env file
   VITE_RECAPTCHA_SITE_KEY=your_site_key_here
   ```

## Formspree.io Configuration

If you use Formspree.io, you should also:

1. Go to your form in Formspree.io
2. In "Settings" → "Spam Protection"
3. Enable "Google reCAPTCHA"
4. Paste your reCAPTCHA **Secret Key**

## Verification

Once configured, the form will:

- ✅ Execute reCAPTCHA automatically when submitting
- ✅ Be invisible to legitimate users
- ✅ Block bots and spam
- ✅ Work without reCAPTCHA if not configured (graceful fallback)

## Fallback without reCAPTCHA

If you don't configure reCAPTCHA, the form will still work with:

- ✅ Zod validation
- ✅ DOMPurify sanitization
- ✅ Suspicious pattern detection
- ✅ Basic browser rate limiting
