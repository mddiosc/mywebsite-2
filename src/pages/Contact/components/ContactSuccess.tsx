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
          className="mx-auto max-w-2xl rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl shadow-gray-900/5 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-gray-900/20"
        >
          {/* Success icon with gradient background */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-accent to-primary">
            <CheckCircleIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t('contact.successTitle')}
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {t('contact.successMessage')}
          </p>
          <button
            type="button"
            onClick={onSendAnother}
            className="group relative mt-8 inline-flex items-center overflow-hidden rounded-full bg-linear-to-r from-primary to-highlight px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative">{t('contact.sendAnotherMessage')}</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
