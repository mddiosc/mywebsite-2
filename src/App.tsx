import { BrowserRouter as Router } from 'react-router'
import { AppRoutes } from './router/routes'
import './i18n/i18n'
import './App.css'

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
