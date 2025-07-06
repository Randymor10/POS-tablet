import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { MenuItem, MenuOption } from '../data/menu';
import { EXTRA_PRICES } from '../utils/extras';

interface ModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onConfirmAdd: (item: MenuItem, selections: Record<string, any>, quantity: number) => void;
}

const ModificationModal: React.FC<ModificationModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmAdd,
}) => {
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && item) {
      // Reset selections when modal opens
      setSelections({});
      setQuantity(1);
      setExtras({});
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSelectionChange = (optionType: string, value: string, isMultiple: boolean = false) => {
    if (isMultiple) {
      const currentValues = selections[optionType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      setSelections({ ...selections, [optionType]: newValues });
    } else {
      setSelections({ ...selections, [optionType]: value });
    }
  };

  const handleExtraToggle = (extraKey: string) => {
    setExtras({ ...extras, [extraKey]: !extras[extraKey] });
  };

  const calculateTotalPrice = () => {
    let total = item.price * quantity;
    
    // Add option prices
    if (item.options) {
      item.options.forEach(option => {
        const selectedValue = selections[option.type];
        if (selectedValue) {
          if (Array.isArray(selectedValue)) {
            selectedValue.forEach(value => {
              const choice = option.choices.find(c => c.value === value);
              if (choice && choice.price) {
                total += choice.price * quantity;
              }
            });
          } else {
            const choice = option.choices.find(c => c.value === selectedValue);
            if (choice && choice.price) {
              total += choice.price * quantity;
            }
          }
        }
      });
    }
    
    // Add extra prices
    Object.entries(extras).forEach(([extraKey, isSelected]) => {
      if (isSelected && EXTRA_PRICES[extraKey]) {
        total += EXTRA_PRICES[extraKey] * quantity;
      }
    });
    
    return total;
  };

  const isFormValid = () => {
    if (!item.options) return true;
    
    return item.options.every(option => {
      if (option.required) {
        const selection = selections[option.type];
        return selection && (Array.isArray(selection) ? selection.length > 0 : true);
      }
      return true;
    });
  };

  const handleConfirm = () => {
    if (!isFormValid()) return;
    
    // Combine selections and extras
    const allSelections = {
      ...selections,
      extras: Object.entries(extras)
        .filter(([_, isSelected]) => isSelected)
        .map(([extraKey]) => extraKey)
    };
    
    onConfirmAdd(item, allSelections, quantity);
    onClose();
  };

  const renderOption = (option: MenuOption) => {
    const selectedValue = selections[option.type];
    
    if (option.multiple) {
      return (
        <div key={option.type} className="mb-6">
          <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            {option.label} {option.required && <span className="text-red-500">*</span>}
          </h4>
          <div className="space-y-2">
            {option.choices.map(choice => (
              <label key={choice.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValue?.includes(choice.value) || false}
                  onChange={() => handleSelectionChange(option.type, choice.value, true)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="flex-1" style={{ color: 'var(--text-primary)' }}>
                  {choice.label}
                </span>
                {choice.price && (
                  <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>
                    +${choice.price.toFixed(2)}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={option.type} className="mb-6">
          <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            {option.label} {option.required && <span className="text-red-500">*</span>}
          </h4>
          <div className="space-y-2">
            {option.choices.map(choice => (
              <label key={choice.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={option.type}
                  value={choice.value}
                  checked={selectedValue === choice.value}
                  onChange={() => handleSelectionChange(option.type, choice.value)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                />
                <span className="flex-1" style={{ color: 'var(--text-primary)' }}>
                  {choice.label}
                </span>
                {choice.price && (
                  <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>
                    +${choice.price.toFixed(2)}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>Customize {item.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="p-6">
          {/* Item Info */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {item.name}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              {item.description}
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
              Base Price: ${item.price.toFixed(2)}
            </p>
          </div>

          {/* Required Options */}
          {item.options && item.options.map(option => renderOption(option))}

          {/* Extra Add-ons */}
          <div className="mb-6">
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Extra Add-ons
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(EXTRA_PRICES).map(([extraKey, price]) => (
                <label key={extraKey} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extras[extraKey] || false}
                    onChange={() => handleExtraToggle(extraKey)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {extraKey.charAt(0).toUpperCase() + extraKey.slice(1)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                    +${price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Quantity
            </h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-semibold min-w-[3rem] text-center" style={{ color: 'var(--text-primary)' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Total:
              </span>
              <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isFormValid()}
              className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isFormValid() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: 'white',
                border: 'none'
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationModal;