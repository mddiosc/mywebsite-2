/**
 * Contact page component with form submission flow
 *
 * Main container component that orchestrates the contact experience by managing
 * the state transition between the contact form and success confirmation.
 * Provides a clean separation between form input and success feedback.
 */

import { useState } from 'react'

import { ContactForm, ContactHeader, ContactSuccess } from './components'

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
  const [showSuccess, setShowSuccess] = useState(false)

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
    <div className="py-24 sm:py-32">
      <ContactHeader />
      <ContactForm onSuccess={handleSuccess} />
    </div>
  )
}

export default Contact
