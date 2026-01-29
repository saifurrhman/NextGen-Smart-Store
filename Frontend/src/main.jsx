import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Tailwind directives here
import './styles/main.scss' // Custom SASS overrides
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
