import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactForm, ContactHeader, ContactSuccess } from './components'

import { DocumentHead } from '../../components'
import { buildLocalizedSeoUrls } from '../../lib/seo'

const RecaptchaProvider = lazy(async () =>
  import('react-google-recaptcha-v3').then((m) => ({ default: m.GoogleReCaptchaProvider })),
)

const ContactContent = ({ locale, onSuccess }: { locale: 'en' | 'es'; onSuccess: () => void }) => {
  const { t } = useTranslation()
  const seoUrls = buildLocalizedSeoUrls(import.meta.env.VITE_SITE_URL, '/contact', locale)

  return (
    <>
      <DocumentHead
        title={`${t('navigation.contact')} - Portfolio`}
        description={t('contact.header.subtitle')}
        keywords="contact, email, message, communication, get in touch"
        canonicalUrl={seoUrls.canonicalUrl}
        alternateUrls={seoUrls.alternateUrls}
      />

      <div className="pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
        <ContactHeader />
        <ContactForm onSuccess={onSuccess} />
      </div>
    </>
  )
}

const Contact = () => {
  const { t, i18n } = useTranslation()
  const [showSuccess, setShowSuccess] = useState(false)
  const locale = i18n.language === 'en' ? 'en' : 'es'
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  const contactEmail = import.meta.env['VITE_CONTACT_EMAIL'] as string | undefined

  const seoUrls = useMemo(
    () => buildLocalizedSeoUrls(import.meta.env.VITE_SITE_URL, '/contact', locale),
    [locale],
  )

  useEffect(() => {
    const addedLinks: HTMLLinkElement[] = []
    const addPreconnect = (href: string, crossOrigin?: string) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      if (crossOrigin) link.crossOrigin = crossOrigin
      document.head.appendChild(link)
      addedLinks.push(link)
    }

    addPreconnect('https://formspree.io', 'anonymous')
    if (recaptchaSiteKey) {
      addPreconnect('https://www.google.com', 'anonymous')
      addPreconnect('https://www.gstatic.com', 'anonymous')
    }

    return () => {
      for (const link of addedLinks) link.remove()
    }
  }, [recaptchaSiteKey])

  const handleSuccess = () => {
    setShowSuccess(true)
  }
  const handleSendAnother = () => {
    setShowSuccess(false)
  }

  const content = useMemo(() => {
    if (showSuccess) return <ContactSuccess onSendAnother={handleSendAnother} />
    return <ContactContent locale={locale} onSuccess={handleSuccess} />
  }, [locale, showSuccess])

  if (showSuccess) return content
  if (!recaptchaSiteKey) {
    return (
      <>
        <DocumentHead
          title={`${t('navigation.contact')} - Portfolio`}
          description={t('contact.header.subtitle')}
          keywords="contact, email, message, communication, get in touch"
          canonicalUrl={seoUrls.canonicalUrl}
          alternateUrls={seoUrls.alternateUrls}
        />
        <div className="pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
          <ContactHeader />
          {contactEmail && (
            <div className="mx-auto mt-10 max-w-xl text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Send me an email at{' '}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </p>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <Suspense fallback={content}>
      <RecaptchaProvider reCaptchaKey={recaptchaSiteKey}>{content}</RecaptchaProvider>
    </Suspense>
  )
}

export default Contact
