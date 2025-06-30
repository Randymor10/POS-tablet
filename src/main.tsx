import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ReceiptPage from './pages/ReceiptPage'
import KioskMenuPage from './pages/KioskMenuPage'
import EmployeeLogin from './components/EmployeeLogin'
import ProtectedRoute from './components/ProtectedRoute'
import { EmployeeProvider } from './contexts/EmployeeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EmployeeProvider>
        <Routes>
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/" element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } />
          <Route path="/kiosk" element={
            <ProtectedRoute>
              <KioskMenuPage />
            </ProtectedRoute>
          } />
          <Route path="/receipt" element={
            <ProtectedRoute>
              <ReceiptPage />
            </ProtectedRoute>
          } />
        </Routes>
      </EmployeeProvider>
    </BrowserRouter>
  </StrictMode>,
)