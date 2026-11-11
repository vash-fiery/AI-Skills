import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Inter + JetBrains Mono (VashFX Ember type), loaded at runtime so the bundler leaves the link alone
const fonts = document.createElement('link')
fonts.rel = 'stylesheet'
fonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap'
document.head.appendChild(fonts)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
