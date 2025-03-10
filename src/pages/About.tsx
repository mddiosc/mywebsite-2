import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { commonTransition, slideIn } from '../lib/animations'

// Define experiencia y estadísticas
const stats = [
  { label: 'Años en desarrollo front-end', value: '5+' },
  { label: 'Experiencia en turismo', value: '14' },
  { label: 'Proyectos completados', value: '20+' },
]

// Define las tecnologías principales
const mainTechnologies = [
  { name: 'React', logo: '/images/tech/react.svg' },
  { name: 'Next.js', logo: '/images/tech/nextjs.svg' },
  { name: 'Vue', logo: '/images/tech/vue.svg' },
  { name: 'Nuxt', logo: '/images/tech/nuxt.svg' },
  { name: 'TypeScript', logo: '/images/tech/typescript.svg' },
]

const About = () => {
  const { t, i18n } = useTranslation()

  const skills = t('pages.about.skills.items', { returnObjects: true }) as string[]

  return (
    <>
      <div className="relative isolate -z-10">
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="about-hero-pattern"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#about-hero-pattern)" width="100%" height="100%" strokeWidth={0} />
        </svg>
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        >
          <div
            style={{
              clipPath:
                'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
            }}
            className="aspect-801/1036 w-[50.0625rem] bg-gradient-to-tr from-indigo-300 to-indigo-600 opacity-30"
          />
        </div>
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pt-36 pb-24 sm:pt-40 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <motion.div
                className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={slideIn}
                transition={{ ...commonTransition, delay: 0.1 }}
              >
                <h2 className="text-base/7 font-semibold text-indigo-600">
                  {t('pages.about.title')}
                </h2>
                <h1 className="mt-3 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl">
                  {t('pages.about.name')}
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                  {t('pages.about.biography.content').split('\n\n')[0]}
                </p>
                <div className="mt-8">
                  <Link
                    to={`/${i18n.language}/projects`}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {t('pages.about.biography.buttonText')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <motion.div
        className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8"
        initial="hidden"
        animate="visible"
        variants={slideIn}
        transition={{ ...commonTransition, delay: 0.5 }}
      >
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            {t('pages.about.biography.title')}
          </h2>
          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
              <div className="space-y-6">
                {t('pages.about.biography.content')
                  .split('\n\n')
                  .map((paragraph, idx) => (
                    <p
                      key={`para-${idx.toString()}`}
                      className={
                        idx === 0 ? 'text-xl/8 text-gray-600' : 'text-base/7 text-gray-700'
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
            <div className="lg:flex lg:flex-auto lg:justify-center">
              <dl className="w-64 space-y-8 xl:w-80">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base/7 text-gray-600">{stat.label}</dt>
                    <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technologies section */}
      <motion.div
        className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={slideIn}
        transition={{ ...commonTransition, delay: 0.7 }}
      >
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            {t('pages.about.skills.title')}
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            JavaScript/TypeScript son mi pasión. Estas son las tecnologías principales con las que
            trabajo.
          </p>
        </div>

        {/* Logo cloud */}
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {mainTechnologies.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center">
              <img
                alt={tech.name}
                src={tech.logo}
                width={80}
                height={80}
                className="max-h-16 w-full object-contain"
              />
              <p className="mt-3 text-sm font-medium text-gray-900">{tech.name}</p>
            </div>
          ))}
        </div>

        {/* All Skills */}
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index.toString()}`}
                className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact section */}
      <motion.div
        className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={slideIn}
        transition={{ ...commonTransition, delay: 0.9 }}
      >
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            {t('pages.about.contact.title')}
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">{t('pages.about.contact.content')}</p>
          <div className="mt-10 flex gap-x-6">
            <a
              href="mailto:ejemplo@correo.com"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enviar email
            </a>
            <Link
              to={`/${i18n.language}/contact`}
              className="text-sm leading-10 font-semibold text-gray-900"
            >
              Formulario de contacto <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default About
