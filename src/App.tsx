import { BrowserRouter as Router } from 'react-router'

import {
  NavigationProgressBar,
  NavigationProgressProvider,
  ScrollToTop,
  SmartRoutePreloader,
} from './components'
import { ThemeProvider } from './context'
import { AppRoutes } from './router/routes'
import './i18n/i18n'
import './styles/App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <NavigationProgressProvider>
          <NavigationProgressBar />
          <ScrollToTop />
          <AppRoutes />
          <SmartRoutePreloader />
        </NavigationProgressProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
