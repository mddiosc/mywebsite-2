/**
 * Contact page header component with LinkedIn integration
 *
 * Displays the contact page introduction with call-to-action messaging
 * and provides a direct LinkedIn connection option as an alternative
 * to the contact form for professional networking.
 */

import { useTranslation } from 'react-i18next'

import { LINKEDIN_URL } from '../constants'

/**
 * Header section for the contact page
 *
 * Features:
 * - Internationalized heading and description text
 * - LinkedIn profile link with icon for professional networking
 * - Responsive design with Tailwind CSS classes
 * - Accessible external link handling
 *
 * @returns JSX element containing the contact page header
 */

export const ContactHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
      <div className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
        <h2 className="text-base/7 font-semibold text-indigo-600">
          {t('pages.projects.portfolio')}
        </h2>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          {t('contact.letsWorkTogether')}
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-lg/8 text-gray-600 lg:max-w-none">
        {t('contact.description')}
      </p>

      {/* LinkedIn CTA */}
      <div className="mt-8">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
              clipRule="evenodd"
            />
          </svg>
          {t('contact.connectLinkedIn')}
        </a>
      </div>
    </div>
  )
}
