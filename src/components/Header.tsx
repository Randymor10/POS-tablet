import React from 'react';
import { Search, Moon, Sun, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useEmployee } from '../contexts/EmployeeContext';
import { useNavigate } from 'react-router-dom';

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
  const { employee, logout } = useEmployee();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Order Menu</h1>
        {employee && (
          <div className="employee-info">
            <span className="employee-name">Welcome, {employee.name}</span>
            <span className="employee-id">ID: {employee.employee_id}</span>
          </div>
        )}
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

        {employee && (
          <button 
            className="icon-button logout-button" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;