import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css' // Main CSS with Tailwind & Theme imports
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
