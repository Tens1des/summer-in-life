import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TimeApp from './TimeApp.jsx'
import './styles/app.css'
import './styles/time.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TimeApp />
  </StrictMode>,
)
