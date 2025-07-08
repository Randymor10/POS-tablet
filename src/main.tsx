import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'
import App from './App.tsx'
import ReceiptPage from './pages/ReceiptPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import KioskMenuPage from './pages/KioskMenuPage'
import SalesTrackingPage from './pages/SalesTrackingPage'
import InventoryTrackingPage from './pages/InventoryTrackingPage'
import EmployeeManagementPage from './pages/EmployeeManagementPage'
import SystemSettingsPage from './pages/SystemSettingsPage'
import { EmployeeProvider } from './contexts/EmployeeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <EmployeeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/kiosk" element={<KioskMenuPage />} />
            <Route path="/receipt" element={<ReceiptPage />} />
            <Route path="/sales-tracking" element={<SalesTrackingPage />} />
            <Route path="/inventory-tracking" element={<InventoryTrackingPage />} />
            <Route path="/employee-management" element={<EmployeeManagementPage />} />
            <Route path="/system-settings" element={<SystemSettingsPage />} />
          </Routes>
        </EmployeeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)