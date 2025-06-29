import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ReceiptPage from './pages/ReceiptPage'
import KioskMenuPage from './pages/KioskMenuPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/kiosk" element={<KioskMenuPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)