/**
 * Contact form success confirmation component
 *
 * Displays a success message after form submission with smooth animations
 * and provides an option for users to send additional messages without
 * leaving the contact flow.
 */

import { useTranslation } from 'react-i18next'

import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

/**
 * Props interface for ContactSuccess component
 */
interface ContactSuccessProps {
  /** Callback function to return to the contact form */
  onSendAnother: () => void
}

/**
 * Success confirmation component for contact form submissions
 *
 * Features:
 * - Animated success icon and message using Framer Motion
 * - Internationalized success text
 * - Call-to-action button to send another message
 * - Consistent styling with the overall contact page design
 *
 * @param props - Component props
 * @param props.onSendAnother - Function to trigger return to form state
 * @returns JSX element containing the success confirmation UI
 */

export const ContactSuccess = ({ onSendAnother }: ContactSuccessProps) => {
  const { t } = useTranslation()

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-3xl font-semibold text-gray-900">{t('contact.successTitle')}</h2>
          <p className="mt-2 text-lg text-gray-600">{t('contact.successMessage')}</p>
          <button
            type="button"
            onClick={onSendAnother}
            className="mt-6 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {t('contact.sendAnotherMessage')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
