import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { menu } from './data/menu';
import type { MenuItem } from './data/menu';
import { getOrderData } from './utils/order';
import { ThemeProvider } from './contexts/ThemeContext';
import { useEmployee } from './contexts/EmployeeContext';
import PageLayout from './layout/PageLayout';
import CategoryTabs from './components/CategoryTabs';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import AdminOptionsModal from './components/AdminOptionsModal';
import ModificationModal from './components/ModificationModal';
import './styles/modern-pos.css';

interface CartItem extends MenuItem {
  quantity: number;
}

// Helper function to determine if an item needs the customization modal
const needsCustomizationModal = (item: MenuItem): boolean => {
  return item.customizable === true && item.options && item.options.some(option => option.required);
};

function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOptionsModalOpen, setIsAdminOptionsModalOpen] = useState(false);
  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);
  const [itemToCustomize, setItemToCustomize] = useState<MenuItem | null>(null);
  
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

  const handleMenuItemClick = (item: MenuItem) => {
    if (needsCustomizationModal(item)) {
      setItemToCustomize(item);
      setIsModificationModalOpen(true);
    } else {
      addToCart(item, {}, 1);
    }
  };

  const addToCart = (item: MenuItem, selections: Record<string, any> = {}, quantity: number = 1) => {
    const itemId = `${item.id}-${Date.now()}-${Math.random()}`;
    
    setCart((prev) => {
      return [...prev, { ...item, id: itemId, quantity }];
    });
    
    if (Object.keys(selections).length > 0) {
      setSelectedExtras((prev) => ({
        ...prev,
        [itemId]: selections
      }));
    }
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
    // This function is no longer used with the new modification system
    // but kept for compatibility with existing cart items
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
    // Navigate to checkout page with order data
    const order = getOrderData(cart, selectedExtras);
    navigate('/checkout', {
      state: {
        order
      }
    });
  };

  const handleAdminAction = (action: string) => {
    console.log('Admin action triggered:', action);
    // Directly navigate to admin pages without any authentication
    window.location.href = `/${action}`;
    setIsAdminOptionsModalOpen(false);
  };

  const order = getOrderData(cart, selectedExtras);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchContainer = (
    <div className="search-container">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder="Search for food, drinks, or categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );

  const headerRightContent = (
    <>
      <button className="icon-button" onClick={() => setIsAdminOptionsModalOpen(true)} title="Admin Options">
        <Menu size={20} />
      </button>
      
      <button className="cart-button" onClick={() => setIsCartOpen(true)}>
        <ShoppingCart size={20} />
        <span>View Order Summary</span>
        {cartItemCount > 0 && (
          <span className="cart-badge">{cartItemCount}</span>
        )}
      </button>
    </>
  );

  return (
    <ThemeProvider>
      <PageLayout
        pageTitle="Order Menu"
        headerCenterContent={searchContainer}
        headerRightContent={headerRightContent}
      >
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <MenuGrid
          items={filteredItems}
          onMenuItemClick={handleMenuItemClick}
          selectedExtras={selectedExtras}
          onToggleExtra={toggleExtra}
        />
      </PageLayout>

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

      <ModificationModal
        isOpen={isModificationModalOpen}
        onClose={() => setIsModificationModalOpen(false)}
        item={itemToCustomize}
        onConfirmAdd={addToCart}
      />
    </ThemeProvider>
  );
}

export default App;