/**
 * Contact form component with validation and security features
 *
 * Comprehensive contact form implementation featuring:
 * - React Hook Form with Zod validation
 * - Real-time client-side validation with internationalized error messages
 * - Google reCAPTCHA v3 integration for spam protection
 * - Smooth animations using Framer Motion
 * - Accessible form controls and error handling
 * - Responsive design optimized for mobile and desktop
 * - React 19's useActionState for optimistic updates
 */

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'

import { fadeIn, slideIn, commonTransition } from '../../../lib/animations'
import { PROJECT_TYPE_OPTIONS } from '../constants'
import { useContactForm } from '../hooks'
import { ContactFormSchema, type ContactFormData } from '../types'

/**
 * Props interface for ContactForm component
 */
interface ContactFormProps {
  /** Callback function executed on successful form submission */
  onSuccess: () => void
}

/**
 * Main contact form component
 *
 * Provides a complete contact form experience with:
 * - Name field with character validation
 * - Email field with format validation
 * - Project type selector with predefined options
 * - Message textarea with character limits and XSS protection
 * - Real-time validation feedback
 * - Loading states during submission
 * - Error handling with user-friendly messages
 *
 * @param props - Component props
 * @param props.onSuccess - Function called when form submission succeeds
 * @returns JSX element containing the complete contact form
 */

export const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  })

  const { submitForm, isPending, isError, isSuccess, errorMessage } = useContactForm()

  // Track if we've already called onSuccess to prevent multiple calls
  const hasCalledOnSuccess = useRef(false)

  // Handle success state changes from React 19's useActionState
  useEffect(() => {
    if (isSuccess && !hasCalledOnSuccess.current) {
      hasCalledOnSuccess.current = true
      reset()
      onSuccess()
    }
  }, [isSuccess, reset, onSuccess])

  // Reset the success flag when form becomes active again
  useEffect(() => {
    if (!isSuccess) {
      hasCalledOnSuccess.current = false
    }
  }, [isSuccess])

  /**
   * Translates Zod validation error messages to localized text
   *
   * Maps validation error keys to their internationalized equivalents
   * for consistent user experience across different languages.
   *
   * @param message - Validation error message key from Zod schema
   * @returns Localized error message or original message if no translation found
   */
  const translateError = (message: string) => {
    const translations: Record<string, string> = {
      'validation.name.min': t('contact.validation.name.min'),
      'validation.name.max': t('contact.validation.name.max'),
      'validation.name.invalid': t('contact.validation.name.invalid'),
      'validation.email.max': t('contact.validation.email.max'),
      'validation.email.invalid': t('contact.validation.email.invalid'),
      'validation.message.min': t('contact.validation.message.min'),
      'validation.message.max': t('contact.validation.message.max'),
      'validation.message.suspicious': t('contact.validation.message.suspicious'),
    }
    return translations[message] ?? message
  }

  /**
   * Handles form submission with React 19's optimistic updates
   *
   * Processes validated form data through the useActionState-powered hook
   * which provides immediate UI feedback via useOptimistic.
   *
   * @param data - Validated contact form data
   */
  const handleFormSubmit = (data: ContactFormData): void => {
    submitForm(data)
  }

  return (
    <>
      {/* Form separator */}
      <div className="mx-auto mt-16 max-w-xl text-center">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
            {t('contact.orUseForm')}
          </span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        </div>
      </div>

      <motion.form
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={slideIn}
        transition={{ ...commonTransition, delay: 0.3 }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(handleFormSubmit)}
        className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-xl shadow-gray-900/5 backdrop-blur-sm sm:mt-12 sm:p-8 dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-gray-900/20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
            >
              {t('contact.name')}{' '}
              <span aria-label={t('accessibility.required', { defaultValue: 'required' })}>*</span>
            </label>
            <div className="mt-2.5">
              <input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-light"
                placeholder={t('contact.namePlaceholder')}
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {translateError(errors.name.message ?? '')}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
            >
              {t('contact.email')}{' '}
              <span aria-label={t('accessibility.required', { defaultValue: 'required' })}>*</span>
            </label>
            <div className="mt-2.5">
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-light"
                placeholder={t('contact.emailPlaceholder')}
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {translateError(errors.email.message ?? '')}
                </p>
              )}
            </div>
          </div>

          {/* Project Type Field */}
          <div>
            <label
              htmlFor="project-type"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
            >
              {t('contact.projectType')}
            </label>
            <div className="mt-2.5">
              <div className="relative">
                <select
                  {...register('project-type')}
                  id="project-type"
                  className="block w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-light"
                >
                  <option value="" className="text-gray-400">
                    {t('contact.projectTypePlaceholder')}
                  </option>
                  {PROJECT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors['project-type'] && (
                <p className="mt-1 text-sm text-red-600">
                  {translateError(errors['project-type'].message ?? '')}
                </p>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div>
            <div className="flex justify-between text-sm/6">
              <label
                htmlFor="message"
                className="block font-semibold text-gray-900 dark:text-gray-100"
              >
                {t('contact.message')}{' '}
                <span aria-label={t('accessibility.required', { defaultValue: 'required' })}>
                  *
                </span>
              </label>
              <p className="text-gray-400 dark:text-gray-500">{t('contact.maxCharacters')}</p>
            </div>
            <div className="mt-2.5">
              <textarea
                {...register('message')}
                id="message"
                rows={4}
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-light"
                placeholder={t('contact.messagePlaceholder')}
                aria-required="true"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                  {translateError(errors.message.message ?? '')}
                </p>
              )}
            </div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ ...commonTransition, delay: 0.5 }}
          className="mt-10"
        >
          {isError && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    {t('contact.errorTitle')}
                  </h3>
                  <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                    {errorMessage?.includes('Rate limit')
                      ? t('contact.rateLimitError', { defaultValue: errorMessage })
                      : t('contact.errorMessage')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="group relative block w-full overflow-hidden rounded-full bg-linear-to-r from-primary to-highlight px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative">
              {isPending ? t('contact.sending') : t('contact.sendMessage')}
            </span>
          </button>
        </motion.div>
      </motion.form>
    </>
  )
}
