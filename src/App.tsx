import React, { useState, useMemo } from 'react';
import { menu } from './data/menu';
import type { MenuItem } from './data/menu';
import { getOrderData } from './utils/order';
import { recordSale } from './utils/sales';
import { verifyEmployeePasscode } from './lib/supabase';
import { ThemeProvider } from './contexts/ThemeContext';
import { useEmployee } from './contexts/EmployeeContext';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import EmployeeIdPromptModal from './components/EmployeeIdPromptModal';
import PasscodeVerificationModal from './components/PasscodeVerificationModal';
import AdminOptionsModal from './components/AdminOptionsModal';
import './styles/modern-pos.css';

interface CartItem extends MenuItem {
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEmployeeIdPromptModalOpen, setIsEmployeeIdPromptModalOpen] = useState(false);
  const [isPasscodeVerificationModalOpen, setIsPasscodeVerificationModalOpen] = useState(false);
  const [isAdminOptionsModalOpen, setIsAdminOptionsModalOpen] = useState(false);
  const [currentActionCallback, setCurrentActionCallback] = useState<(() => void) | null>(null);
  const [passcodeVerificationContext, setPasscodeVerificationContext] = useState<{
    title: string;
    message: string;
    requiredRole?: string;
  }>({
    title: '',
    message: ''
  });
  
  const { employee } = useEmployee();

  const categories = Array.from(new Set(menu.map((m) => m.category)));

  const filteredItems = useMemo(() => {
    let items = menu;

    // Filter by search term
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory === 'Popular') {
      // Show popular items (you can customize this logic)
      items = items.slice(0, 8);
    } else {
      items = items.filter((item) => item.category === activeCategory);
    }

    return items;
  }, [searchTerm, activeCategory]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      setSelectedExtras((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const toggleExtra = (itemId: string, extra: string) => {
    setSelectedExtras((prev) => {
      const currentExtras = prev[itemId] || [];
      const updated = currentExtras.includes(extra)
        ? currentExtras.filter((e) => e !== extra)
        : [...currentExtras, extra];
      return { ...prev, [itemId]: updated };
    });
  };

  const executeCheckout = async () => {
    if (!employee) return;

    const order = getOrderData(cart, selectedExtras);
    
    // Record the sale in the database
    const saleRecorded = await recordSale(employee.employee_id, order);
    
    if (saleRecorded) {
      console.log('🧾 Order recorded:', order);
      console.log('👤 Sold by:', employee.name, `(${employee.employee_id})`);
      alert(`Order completed by ${employee.name}! Sale recorded successfully.`);
    } else {
      console.log('🧾 Order (not recorded):', order);
      alert('Order sent to kitchen! (Sale recording failed - check console)');
    }
    
    // Clear cart
    setCart([]);
    setSelectedExtras({});
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    if (!employee) {
      // No employee logged in, prompt for employee ID first
      setCurrentActionCallback(() => executeCheckout);
      setIsEmployeeIdPromptModalOpen(true);
    } else {
      // Employee is logged in, proceed to passcode verification
      setCurrentActionCallback(() => executeCheckout);
      setPasscodeVerificationContext({
        title: "Complete Order",
        message: "Please enter your passcode to complete this order"
      });
      setIsPasscodeVerificationModalOpen(true);
    }
  };

  const handleEmployeeIdSubmitted = () => {
    // Employee ID has been entered and employee is now logged in
    // Proceed to passcode verification
    setIsEmployeeIdPromptModalOpen(false);
    setPasscodeVerificationContext({
      title: "Complete Order",
      message: "Please enter your passcode to complete this order"
    });
    setIsPasscodeVerificationModalOpen(true);
  };

  const handleAdminAction = (action: string) => {
    // Determine required role based on action
    let requiredRole: string;
    let title: string;
    let message: string;

    switch (action) {
      case 'sales-tracking':
      case 'inventory-tracking':
        requiredRole = 'manager';
        title = 'Manager Access Required';
        message = 'Please enter your passcode to access manager features';
        break;
      case 'employee-management':
      case 'system-settings':
        requiredRole = 'admin';
        title = 'Admin Access Required';
        message = 'Please enter your passcode to access admin features';
        break;
      default:
        requiredRole = 'manager';
        title = 'Admin Access Required';
        message = 'Please enter your passcode to access admin features';
    }

    if (!employee) {
      // No employee logged in, prompt for employee ID first
      setCurrentActionCallback(() => {
        // Navigate to admin page after verification
        window.location.href = `/${action}`;
      });
      setIsEmployeeIdPromptModalOpen(true);
    } else {
      // Employee is logged in, check role and verify passcode
      setCurrentActionCallback(() => {
        window.location.href = `/${action}`;
      });
      setPasscodeVerificationContext({
        title,
        message,
        requiredRole
      });
      setIsPasscodeVerificationModalOpen(true);
    }
    setIsAdminOptionsModalOpen(false);
  };

  const handlePasscodeVerified = async (passcode: string): Promise<boolean> => {
    // CRITICAL FIX: Validate passcode input before proceeding
    if (!passcode || !passcode.trim()) {
      return false; // Reject empty or whitespace-only passcodes
    }

    if (!employee) {
      return false; // No employee logged in
    }

    // Check if this action requires a specific role
    if (passcodeVerificationContext.requiredRole) {
      const requiredRole = passcodeVerificationContext.requiredRole;
      if (!['manager', 'admin'].includes(employee.role) && employee.role !== requiredRole) {
        return false; // Employee doesn't have required role
      }
    }

    try {
      const isValid = await verifyEmployeePasscode(employee.employee_id, passcode.trim());
      
      if (isValid && currentActionCallback) {
        // Only execute the callback if passcode verification was successful
        currentActionCallback();
        setCurrentActionCallback(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Passcode verification error:', error);
      return false;
    }
  };

  const handlePasscodeModalClose = () => {
    setIsPasscodeVerificationModalOpen(false);
    setCurrentActionCallback(null);
    setPasscodeVerificationContext({ title: '', message: '' });
  };

  const handleEmployeeIdModalClose = () => {
    setIsEmployeeIdPromptModalOpen(false);
    setCurrentActionCallback(null);
  };

  const order = getOrderData(cart, selectedExtras);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ThemeProvider>
      <div className="pos-app">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
          onAdminClick={() => setIsAdminOptionsModalOpen(true)}
        />

        <main className="main-content">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <MenuGrid
            items={filteredItems}
            onAddToCart={addToCart}
            selectedExtras={selectedExtras}
            onToggleExtra={toggleExtra}
          />
        </main>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          order={order}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
        />

        <EmployeeIdPromptModal
          isOpen={isEmployeeIdPromptModalOpen}
          onClose={handleEmployeeIdModalClose}
          onEmployeeIdSubmitted={handleEmployeeIdSubmitted}
        />

        <PasscodeVerificationModal
          isOpen={isPasscodeVerificationModalOpen}
          onClose={handlePasscodeModalClose}
          onVerify={handlePasscodeVerified}
          title={passcodeVerificationContext.title}
          message={passcodeVerificationContext.message}
        />

        <AdminOptionsModal
          isOpen={isAdminOptionsModalOpen}
          onClose={() => setIsAdminOptionsModalOpen(false)}
          onAdminAction={handleAdminAction}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;