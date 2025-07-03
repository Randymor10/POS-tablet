import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ReceiptPage from './pages/ReceiptPage'
import KioskMenuPage from './pages/KioskMenuPage'
import SalesTrackingPage from './pages/SalesTrackingPage'
import InventoryTrackingPage from './pages/InventoryTrackingPage'
import ProtectedRoute from './components/ProtectedRoute'
import { EmployeeProvider } from './contexts/EmployeeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
                <p>This feature is coming soon!</p>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/system-settings" element={
            <ProtectedRoute requiredRole="admin">
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">System Settings</h1>
                <p>This feature is coming soon!</p>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </EmployeeProvider>
    </BrowserRouter>
  </StrictMode>,
)