import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { EnvelopeIcon } from '@heroicons/react/24/outline'

const GitHubIcon = (props: React.ComponentProps<'svg'>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

const LinkedInIcon = (props: React.ComponentProps<'svg'>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
)

export default function Footer() {
  const { t, i18n } = useTranslation()
  const currentYear = new Date().getFullYear()

  const navigation = [
    {
      name: 'GitHub',
      href: 'https://github.com/mddiosc',
      isInternal: false,
      icon: GitHubIcon,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mddiosc/',
      isInternal: false,
      icon: LinkedInIcon,
    },
    {
      name: t('footer.contact'),
      href: `/${i18n.language}/contact`,
      isInternal: true,
      icon: EnvelopeIcon,
    },
  ]

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center gap-x-6 md:order-2">
            {navigation.map((item) =>
              item.isInternal ? (
                <Link key={item.name} to={item.href} className="text-gray-600 hover:text-gray-800">
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </a>
              ),
            )}
          </div>
          <p className="mt-8 text-center text-sm text-gray-600 md:order-1 md:mt-0">
            &copy; {currentYear} Miguel Ángel de Dios. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
