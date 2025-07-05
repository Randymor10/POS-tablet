import React, { useState, useMemo } from 'react';
import { menu } from './data/menu';
import type { MenuItem } from './data/menu';
import { getOrderData } from './utils/order';
import { ThemeProvider } from './contexts/ThemeContext';
import { useEmployee } from './contexts/EmployeeContext';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
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
  const [isAdminOptionsModalOpen, setIsAdminOptionsModalOpen] = useState(false);
  
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
    const order = getOrderData(cart, selectedExtras);
    
    // For now, just show the order without recording to database
    console.log('🧾 Order:', order);
    alert('Order sent to kitchen!');
    
    // Clear cart
    setCart([]);
    setSelectedExtras({});
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    // Directly execute checkout without any authentication
    executeCheckout();
  };

  const handleAdminAction = (action: string) => {
    console.log('Admin action triggered:', action);
    // Directly navigate to admin pages without any authentication
    window.location.href = `/${action}`;
    setIsAdminOptionsModalOpen(false);
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