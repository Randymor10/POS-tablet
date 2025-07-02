import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import PasscodeVerificationModal from './components/PasscodeVerificationModal';
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
  const [isPasscodeVerificationModalOpen, setIsPasscodeVerificationModalOpen] = useState(false);
  const [currentActionCallback, setCurrentActionCallback] = useState<(() => void) | null>(null);
  
  const { employee } = useEmployee();
  const navigate = useNavigate();

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
    if (!employee) {
      navigate('/login');
      return;
    }

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
    if (!employee) {
      navigate('/login');
      return;
    }

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
      navigate('/login');
      return;
    }

    // Set up passcode verification for checkout
    setCurrentActionCallback(() => executeCheckout);
    setIsPasscodeVerificationModalOpen(true);
  };

  const handleQuickOrder = () => {
    if (cart.length > 0) {
      handleCheckout();
    } else {
      alert('Add items to your cart first!');
    }
  };

  const handlePasscodeVerified = async (passcode: string): Promise<boolean> => {
    if (!employee) return false;

    const isValid = await verifyEmployeePasscode(employee.employee_id, passcode);
    
    if (isValid && currentActionCallback) {
      currentActionCallback();
      setCurrentActionCallback(null);
      return true;
    }
    
    return false;
  };

  const handlePasscodeModalClose = () => {
    setIsPasscodeVerificationModalOpen(false);
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
          onQuickOrder={handleQuickOrder}
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

        <PasscodeVerificationModal
          isOpen={isPasscodeVerificationModalOpen}
          onClose={handlePasscodeModalClose}
          onVerify={handlePasscodeVerified}
          title="Complete Order"
          message="Please enter your passcode to complete this order"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;