import React from 'react';
import { Plus } from 'lucide-react';
import type { MenuItem } from '../data/menu';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  selectedExtras: Record<string, string[]>;
  onToggleExtra: (itemId: string, extra: string) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onAddToCart,
  selectedExtras,
  onToggleExtra,
}) => {
  const EXTRA_PRICES: Record<string, number> = {
    meat: 3.0,
    cheese: 1.5,
    guac: 2.79,
    veggies: 0.5,
    sourcream: 1.5,
    rice: 3.25,
    beans: 3.25,
    pico: 2.5,
    fries: 1.5,
    sauce: 0.5,
    eggs: 3.25,
    garlicbread: 2.5,
  };

  return (
    <div className="menu-grid">
      {items.map((item) => (
        <div key={item.id} className="menu-item-card">
          <div className="item-image-placeholder">
            <span className="item-emoji">🌮</span>
          </div>
          
          <div className="item-content">
            <div className="item-header">
              <h3 className="item-name">{item.name}</h3>
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
            
            <p className="item-description">{item.description}</p>
            
            {Object.keys(EXTRA_PRICES).length > 0 && (
              <details className="extras-section">
                <summary className="extras-toggle">Customize</summary>
                <div className="extras-list">
                  {Object.entries(EXTRA_PRICES).map(([extra, price]) => (
                    <label key={extra} className="extra-item">
                      <input
                        type="checkbox"
                        checked={selectedExtras[item.id]?.includes(extra) || false}
                        onChange={() => onToggleExtra(item.id, extra)}
                      />
                      <span className="extra-name">
                        {extra.charAt(0).toUpperCase() + extra.slice(1)}
                      </span>
                      <span className="extra-price">+${price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </details>
            )}
            
            <button
              className="add-to-cart-button"
              onClick={() => onAddToCart(item)}
            >
              <Plus size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;