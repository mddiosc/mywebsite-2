import { BrowserRouter as Router } from 'react-router'

import { ScrollToTop, SmartRoutePreloader } from './components'
import { AppRoutes } from './router/routes'
import './i18n/i18n'
import './styles/App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
      <SmartRoutePreloader />
    </Router>
  )
}

export default App
