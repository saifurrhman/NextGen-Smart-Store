import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css' // Main CSS with Tailwind & Theme imports
import './i18n'
import App from './App.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </ThemeProvider>
  </StrictMode>,
)
