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
  const [baseIngredients, setBaseIngredients] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && item) {
      // Reset selections when modal opens
      setSelections({});
      setQuantity(1);
      setBaseIngredients({});
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
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{
                backgroundColor: selectedValue?.includes(choice.value) ? '#fff7ed' : 'white',
                borderColor: selectedValue?.includes(choice.value) ? '#fb923c' : '#e5e7eb',
                color: '#1f2937'
              }}
            >
              <div className="font-medium text-sm">{choice.label}</div>
              {choice.price && (
                <div className="text-xs text-orange-600 mt-1">
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
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{
                backgroundColor: selectedValue === choice.value ? '#fff7ed' : 'white',
                borderColor: selectedValue === choice.value ? '#fb923c' : '#e5e7eb',
                color: '#1f2937'
              }}
            >
              <div className="font-medium text-sm">{choice.label}</div>
              {choice.price && (
                <div className="text-xs text-orange-600 mt-1">
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
    // Common base ingredients for most items
    const commonIngredients = [
      { key: 'rice', label: 'Spanish Rice' },
      { key: 'beans', label: 'Beans' },
      { key: 'cheese', label: 'Cheese' },
      { key: 'lettuce', label: 'Lettuce' },
      { key: 'pico', label: 'Pico de Gallo' },
      { key: 'sour-cream', label: 'Sour Cream' },
      { key: 'guacamole', label: 'Guacamole' }
    ];

    const levels = [
      { value: 'none', label: 'None' },
      { value: 'light', label: 'Light' },
      { value: 'regular', label: 'Regular' },
      { value: 'extra', label: 'Extra' }
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-semibold text-gray-900">Base Ingredients</h4>
          <button
            onClick={() => {
              const resetIngredients: Record<string, string> = {};
              commonIngredients.forEach(ingredient => {
                resetIngredients[ingredient.key] = 'regular';
              });
              setBaseIngredients(resetIngredients);
            }}
            className="text-orange-600 text-xs font-medium hover:text-orange-700"
          >
            🔄 Reset to Default
          </button>
        </div>
        
        {commonIngredients.map(ingredient => (
          <div key={ingredient.key} className="space-y-2">
            <h5 className="font-medium text-sm text-gray-900">{ingredient.label}</h5>
            <div className="grid grid-cols-4 gap-2">
              {levels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleBaseIngredientChange(ingredient.key, level.value)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    baseIngredients[ingredient.key] === level.value
                      ? level.value === 'regular'
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
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
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h2>
            <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Required Options */}
          {item.options && item.options.map(option => (
            <div key={option.type} className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">
                {option.label} {option.required && <span className="text-red-500">(Required)</span>}
              </h3>
              {renderChoiceButtons(option)}
            </div>
          ))}

          {/* Base Ingredients Section */}
          {renderBaseIngredients()}
        </div>

        {/* Footer with Quantity and Total */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={14} className="text-gray-600" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={14} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
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
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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
