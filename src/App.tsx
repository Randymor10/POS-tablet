import React, { useState, useMemo } from 'react';
import { menu } from './data/menu';
import type { MenuItem } from './data/menu';
import { getOrderData } from './utils/order';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
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

  const handleCheckout = () => {
    const order = getOrderData(cart, selectedExtras);
    console.log('🧾 Order:', order);
    alert('Order sent to kitchen! Check console for details.');
    setCart([]);
    setSelectedExtras({});
    setIsCartOpen(false);
  };

  const handleQuickOrder = () => {
    if (cart.length > 0) {
      handleCheckout();
    } else {
      alert('Add items to your cart first!');
    }
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
      </div>
    </ThemeProvider>
  );
}

export default App;