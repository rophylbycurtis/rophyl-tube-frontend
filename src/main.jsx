import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#111118',
          color: '#e2e2f0',
          border: '1px solid #1e1e2e',
          borderRadius: '12px',
        },
        success: {
          iconTheme: { primary: '#E8001D', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#E8001D', secondary: '#fff' },
        },
      }}
    />
  </StrictMode>,
)