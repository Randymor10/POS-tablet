import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'
import App from './App.tsx'
import ReceiptPage from './pages/ReceiptPage'
import KioskMenuPage from './pages/KioskMenuPage'
import SalesTrackingPage from './pages/SalesTrackingPage'
import InventoryTrackingPage from './pages/InventoryTrackingPage'
import ProtectedRoute from './components/ProtectedRoute'
import EmployeeManagementPage from './pages/EmployeeManagementPage'
import SystemSettingsPage from './pages/SystemSettingsPage'
import { EmployeeProvider } from './contexts/EmployeeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <EmployeeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/kiosk" element={<KioskMenuPage />} />
            <Route path="/receipt" element={<ReceiptPage />} />
            <Route path="/sales-tracking" element={
              <ProtectedRoute requiredRole="manager">
                <SalesTrackingPage />
              </ProtectedRoute>
            } />
            <Route path="/inventory-tracking" element={
              <ProtectedRoute requiredRole="manager">
                <InventoryTrackingPage />
              </ProtectedRoute>
            } />
            <Route path="/employee-management" element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/system-settings" element={
              <ProtectedRoute requiredRole="admin">
                <SystemSettingsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </EmployeeProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)