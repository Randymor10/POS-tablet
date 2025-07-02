import React, { useState, useMemo } from 'react';
import { menu } from './data/menu';
import type { MenuItem } from './data/menu';
import { getOrderData } from './utils/order';
import { recordSale } from './utils/sales';
import { ThemeProvider } from './contexts/ThemeContext';
import { useEmployee } from './contexts/EmployeeContext';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import PasscodeLoginModal from './components/PasscodeLoginModal';
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const { employee, isLoggedIn } = useEmployee();

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
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
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
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
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

  const handleCheckout = async () => {
    if (!employee) {
      setIsLoginModalOpen(true);
      return;
    }

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

  const handleLoginModalClose = () => {
    // Remove conditional check - always close the modal when requested
    setIsLoginModalOpen(false);
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
          onCartClick={() => isLoggedIn ? setIsCartOpen(true) : setIsLoginModalOpen(true)}
          onLoginClick={() => setIsLoginModalOpen(true)}
          isLoggedIn={isLoggedIn}
        />

        <div className={`pos-app-content-area ${!isLoggedIn ? 'pos-app-content-area--disabled' : ''}`}>
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
        </div>

        <PasscodeLoginModal
          isOpen={isLoginModalOpen}
          onClose={handleLoginModalClose}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;