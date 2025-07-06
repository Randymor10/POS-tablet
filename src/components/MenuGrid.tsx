import React from 'react';
import { Plus } from 'lucide-react';
import type { MenuItem } from '../data/menu';

// Helper function to determine if an item needs the customization modal
const needsCustomizationModal = (item: MenuItem): boolean => {
  return item.customizable === true && item.options && item.options.some(option => option.required);
};

interface MenuGridProps {
  items: MenuItem[];
  onMenuItemClick: (item: MenuItem) => void;
  selectedExtras: Record<string, string[]>;
  onToggleExtra: (itemId: string, extra: string) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onMenuItemClick,
  selectedExtras,
  onToggleExtra,
}) => {

  return (
    <div className="menu-grid">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="menu-item-card"
          onClick={() => onMenuItemClick(item)}
        >
          <div className="item-image-placeholder">
            <span className="item-emoji">🌮</span>
          </div>
          
          <div className="item-content">
            <div className="item-header">
              <h3 className="item-name">{item.name}</h3>
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
            
            <p className="item-description">{item.description}</p>
            
            {item.customizable && (
              <div className="customization-note">
                <span className="text-sm" style={{ color: 'var(--accent-primary)' }}>
                  ✨ Customizable options available
                </span>
              </div>
            )}
            
            <div className="add-to-cart-button-display">
              <Plus size={16} />
              {needsCustomizationModal(item) ? 'Customize & Add' : 'Add to Cart'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;