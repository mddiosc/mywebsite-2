import { BrowserRouter as Router } from 'react-router'

import {
  NavigationProgressBar,
  NavigationProgressProvider,
  ScrollToTop,
  SmartRoutePreloader,
} from './components'
import { AppRoutes } from './router/routes'
import './i18n/i18n'
import './styles/App.css'

function App() {
  return (
    <Router>
      <NavigationProgressProvider>
        <NavigationProgressBar />
        <ScrollToTop />
        <AppRoutes />
        <SmartRoutePreloader />
      </NavigationProgressProvider>
    </Router>
  )
}

export default App
