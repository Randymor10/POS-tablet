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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

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
      
      // Initialize base ingredients to regular (excluding beans since they're in required options)
      const initialBaseIngredients: Record<string, string> = {};
      if (item.baseIngredients) {
        item.baseIngredients
          .filter(ingredient => ingredient.name !== 'beans') // Exclude beans
          .forEach(ingredient => {
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
    
    // Special handling for beans - add "No Beans" option
    let choices = option.choices;
    if (option.type === 'beans') {
      choices = [
        { value: 'no-beans', label: 'No Beans' },
        ...option.choices
      ];
    }
    
    if (option.multiple) {
      return (
        <div className="grid grid-cols-3 gap-2">
          {choices.map(choice => (
            <button
              key={choice.value}
              onClick={() => handleSelectionChange(option.type, choice.value, true)}
              className={`p-2 rounded-md border text-center transition-all text-sm ${
                selectedValue?.includes(choice.value)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{choice.label}</div>
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
        <div className="grid grid-cols-3 gap-2">
          {choices.map(choice => (
            <button
              key={choice.value}
              onClick={() => handleSelectionChange(option.type, choice.value)}
              className={`p-2 rounded-md border text-center transition-all text-sm ${
                selectedValue === choice.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{choice.label}</div>
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
    if (!item.baseIngredients || item.baseIngredients.length === 0) {
      return null;
    }

    // Filter out beans since they're handled in required options
    const filteredIngredients = item.baseIngredients.filter(ingredient => ingredient.name !== 'beans');
    
    if (filteredIngredients.length === 0) {
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
          <h4 className="text-base font-semibold text-gray-800">Base Ingredients</h4>
          <button
            onClick={() => {
              const resetIngredients: Record<string, string> = {};
              filteredIngredients.forEach(ingredient => {
                resetIngredients[ingredient.name] = ingredient.defaultLevel;
              });
              setBaseIngredients(resetIngredients);
            }}
            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            🔄 Reset to Default
          </button>
        </div>
        
        {filteredIngredients.map(ingredient => (
          <div key={ingredient.name} className="space-y-2">
            <h5 className="font-medium text-sm text-gray-700">{ingredient.label}</h5>
            <div className="grid grid-cols-4 gap-2">
              {levels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleBaseIngredientChange(ingredient.name, level.value)}
                  className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                    baseIngredients[ingredient.name] === level.value
                      ? level.value === 'regular'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-gray-200 text-gray-800 border-gray-300'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  } border`}
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
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col" 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            position: 'relative',
            zIndex: 10000
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start p-4 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Required Options */}
            {item.options && item.options.map(option => (
              <div key={option.type} className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800">
                  {option.label} {option.required && <span className="text-orange-600">(Required)</span>}
                </h3>
                {renderChoiceButtons(option)}
              </div>
            ))}

            {/* Base Ingredients Section */}
            {renderBaseIngredients()}
          </div>

          {/* Footer with Quantity and Total */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-base font-semibold min-w-[1.5rem] text-center text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    ${calculateTotalPrice().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleConfirm}
                disabled={!isFormValid()}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all ${
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
    </>
  );
};

export default ModificationModal;