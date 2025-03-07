import { Outlet } from 'react-router'

import Footer from './Footer'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex w-full flex-1">
        <div className="mx-auto max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
