import React from 'react';
import { Search, Moon, Sun, ShoppingCart, User, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cartItemCount: number;
  onCartClick: () => void;
  onQuickOrder: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  cartItemCount,
  onCartClick,
  onQuickOrder,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Order Menu</h1>
      </div>

      <div className="header-center">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for food, drinks, or categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-button" onClick={toggleTheme} title="Toggle theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="icon-button" title="User account">
          <User size={20} />
        </button>
        
        <button className="icon-button" title="Menu">
          <Menu size={20} />
        </button>
        
        <button className="cart-button" onClick={onCartClick}>
          <ShoppingCart size={20} />
          <span>View Order Summary</span>
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </button>
        
        <button className="quick-order-button" onClick={onQuickOrder}>
          Quick Order
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;