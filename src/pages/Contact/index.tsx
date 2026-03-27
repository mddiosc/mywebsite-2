/**
 * Contact page component with form submission flow
 *
 * Main container component that orchestrates the contact experience by managing
 * the state transition between the contact form and success confirmation.
 * Provides a clean separation between form input and success feedback.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactForm, ContactHeader, ContactSuccess } from './components'

import { DocumentHead } from '../../components'
import { buildLocalizedSeoUrls } from '../../lib/seo'

/**
 * Contact page root component
 *
 * Manages the contact form submission flow with two distinct states:
 * 1. Form state: Displays header and contact form
 * 2. Success state: Shows confirmation message with option to send another
 *
 * @returns JSX element containing the complete contact page experience
 */
const Contact = () => {
  const { t, i18n } = useTranslation()
  const [showSuccess, setShowSuccess] = useState(false)
  const locale = i18n.language === 'en' ? 'en' : 'es'
  const seoUrls = buildLocalizedSeoUrls(import.meta.env.VITE_SITE_URL, '/contact', locale)

  /**
   * Handles successful form submission
   * Transitions the UI to the success state
   */
  const handleSuccess = () => {
    setShowSuccess(true)
  }

  /**
   * Handles user request to send another message
   * Returns the UI to the form state for additional submissions
   */
  const handleSendAnother = () => {
    setShowSuccess(false)
  }

  if (showSuccess) {
    return <ContactSuccess onSendAnother={handleSendAnother} />
  }

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
        <ContactForm onSuccess={handleSuccess} />
      </div>
    </>
  )
}

export default Contact
