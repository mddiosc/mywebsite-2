import { Outlet } from 'react-router'

import { Analytics } from '@vercel/analytics/react'
import { motion } from 'framer-motion'

import { commonTransition, fadeIn } from '../lib/animations'

import { Footer, Navbar } from '.'

const clipPath =
  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'

const BackgroundDecoration = ({
  position,
  delay = 0,
  rotate = false,
}: {
  position: string
  delay?: number
  rotate?: boolean
}) => (
  <motion.div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 ${position} -z-10 overflow-hidden blur-3xl`}
    style={{
      WebkitBackfaceVisibility: 'hidden',
      WebkitTransform: 'translate3d(0, 0, 0)',
      transform: 'translate3d(0, 0, 0)',
    }}
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    transition={{ ...commonTransition, duration: 1, delay }}
  >
    <div
      style={{
        clipPath,
        WebkitClipPath: clipPath,
      }}
      className={`relative ${rotate ? 'left-[calc(50%-11rem)]' : 'left-[calc(50%+3rem)]'} aspect-[1155/678] ${rotate ? 'w-[36.125rem]' : 'w-[36.125rem]'} -translate-x-1/2 ${rotate ? 'rotate-[30deg]' : ''} bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 ${rotate ? 'sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]' : 'sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'}`}
    />
  </motion.div>
)

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
      <Navbar />
      <main className="relative isolate flex min-h-[60vh] w-full flex-1">
        <BackgroundDecoration position="-top-40 sm:-top-80" rotate />
        <div className="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:px-6 md:px-8 lg:px-10">
          <Outlet />
        </div>
        <BackgroundDecoration
          position="top-[calc(100%-13rem)] sm:top-[calc(100%-40rem)]"
          delay={0.2}
        />
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}

export default Layout
