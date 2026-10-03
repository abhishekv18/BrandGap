import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'

// Every load and refresh starts at the top (deep links to a #section excepted).
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
