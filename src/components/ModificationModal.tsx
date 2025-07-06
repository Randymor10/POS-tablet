import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { MenuItem, MenuOption, BaseIngredient } from '../data/menu';

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
  const [baseIngredients, setBaseIngredients] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && item) {
      // Reset selections when modal opens
      const initialSelections: Record<string, any> = {};
      
      // Auto-select first choice for required single-choice options
      if (item.options) {
        item.options.forEach(option => {
          if (option.required && !option.multiple && option.choices.length > 0) {
            initialSelections[option.type] = option.choices[0].value;
          }
        });
      }
      
      setSelections(initialSelections);
      setQuantity(1);
      
      // Initialize base ingredients to regular
      const initialBaseIngredients: Record<string, string> = {};
      if (item.baseIngredients) {
        item.baseIngredients.forEach(ingredient => {
          initialBaseIngredients[ingredient.name] = ingredient.defaultLevel;
        });
      }
      setBaseIngredients(initialBaseIngredients);
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

  const handleBaseIngredientChange = (ingredient: string, level: string) => {
    setBaseIngredients({ ...baseIngredients, [ingredient]: level });
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
    
    // Combine selections and base ingredients
    const allSelections = {
      ...selections,
      baseIngredients
    };
    
    onConfirmAdd(item, allSelections, quantity);
    onClose();
  };

  const renderChoiceButtons = (option: MenuOption) => {
    const selectedValue = selections[option.type];
    
    if (option.multiple) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {option.choices.map(choice => (
            <button
              key={choice.value}
              onClick={() => handleSelectionChange(option.type, choice.value, true)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                selectedValue?.includes(choice.value)
                  ? 'border-orange-400'
                  : 'hover:border-gray-300'
              }`}
              style={{
                backgroundColor: selectedValue?.includes(choice.value) ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                borderColor: selectedValue?.includes(choice.value) ? 'var(--accent-primary)' : 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="font-medium text-sm">{choice.label}</div>
              {choice.price && (
                <div className="text-xs mt-1" style={{ color: 'var(--accent-primary)' }}>
                  +${choice.price.toFixed(2)}
                </div>
              )}
            </button>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-3">
          {option.choices.map(choice => (
            <button
              key={choice.value}
              onClick={() => handleSelectionChange(option.type, choice.value)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                selectedValue === choice.value
                  ? 'border-orange-400'
                  : 'hover:border-gray-300'
              }`}
              style={{
                backgroundColor: selectedValue === choice.value ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                borderColor: selectedValue === choice.value ? 'var(--accent-primary)' : 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="font-medium text-sm">{choice.label}</div>
              {choice.price && (
                <div className="text-xs mt-1" style={{ color: 'var(--accent-primary)' }}>
                  +${choice.price.toFixed(2)}
                </div>
              )}
            </button>
          ))}
        </div>
      );
    }
  };

  const renderBaseIngredients = () => {
    if (!item.baseIngredients || item.baseIngredients.length === 0) {
      return null;
    }

    const levels = [
      { value: 'none', label: 'None' },
      { value: 'light', label: 'Light' },
      { value: 'regular', label: 'Regular' },
      { value: 'extra', label: 'Extra' }
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Base Ingredients</h4>
          <button
            onClick={() => {
              const resetIngredients: Record<string, string> = {};
              item.baseIngredients?.forEach(ingredient => {
                resetIngredients[ingredient.name] = ingredient.defaultLevel;
              });
              setBaseIngredients(resetIngredients);
            }}
            className="text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-primary)' }}
          >
            🔄 Reset to Default
          </button>
        </div>
        
        {item.baseIngredients.map(ingredient => (
          <div key={ingredient.name} className="space-y-2">
            <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{ingredient.label}</h5>
            <div className="grid grid-cols-4 gap-2">
              {levels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleBaseIngredientChange(ingredient.name, level.value)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    baseIngredients[ingredient.name] === level.value
                      ? level.value === 'regular'
                        ? 'text-white'
                        : 'text-gray-900'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: baseIngredients[ingredient.name] === level.value
                      ? level.value === 'regular'
                        ? 'var(--accent-primary)'
                        : 'var(--bg-tertiary)'
                      : 'var(--bg-secondary)',
                    border: `1px solid var(--border-color)`,
                    color: baseIngredients[ingredient.name] === level.value && level.value === 'regular'
                      ? 'white'
                      : 'var(--text-primary)'
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-2 p-1 rounded-full transition-colors flex-shrink-0"
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--text-muted)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Required Options */}
          {item.options && item.options.map(option => (
            <div key={option.type} className="space-y-3">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {option.label} {option.required && <span style={{ color: 'var(--accent-primary)' }}>(Required)</span>}
              </h3>
              {renderChoiceButtons(option)}
            </div>
          ))}

          {/* Base Ingredients Section */}
          {renderBaseIngredients()}
        </div>

        {/* Footer with Quantity and Total */}
        <div className="p-4 flex-shrink-0" style={{ 
          borderTop: '1px solid var(--border-color)', 
          backgroundColor: 'var(--bg-secondary)' 
        }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Quantity:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      border: `1px solid var(--border-color)`,
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-lg font-semibold min-w-[2rem] text-center" style={{ color: 'var(--text-primary)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      border: `1px solid var(--border-color)`,
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  ${calculateTotalPrice().toFixed(2)}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleConfirm}
              disabled={!isFormValid()}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                isFormValid()
                  ? 'text-white'
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                backgroundColor: isFormValid() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isFormValid() ? 'white' : 'var(--text-muted)'
              }}
              onMouseEnter={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                }
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