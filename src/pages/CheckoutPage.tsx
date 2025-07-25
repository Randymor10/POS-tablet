import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Clock, Store, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useEmployee } from '../contexts/EmployeeContext';
import type { OrderData } from '../utils/order';

interface CustomerInfo {
  name: string;
  phone?: string;
  pickupOption: 'now' | 'later';
  pickupTime?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = useEmployee();
  
  const order: OrderData = location.state?.order;
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    pickupOption: 'now',
    pickupTime: ''
  });
  
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatOrderForWebhook = (order: OrderData, customerInfo: CustomerInfo, orderNumber: string) => {
    return order.items.map(item => {
      const webhookItem: any = {
        item: item.name,
        quantity: item.quantity
      };

      // Parse customizations to extract modifiers
      const modifiers: string[] = [];
      
      if (item.customizations) {
        const customizations = item.customizations.split(';');
        
        customizations.forEach(customization => {
          const [key, value] = customization.split(':').map(s => s.trim());
          
          if (key && value) {
            // Handle meat selection
            if (key === 'meat' && value !== 'no-meat') {
              webhookItem.meat = value;
            }
            
            // Handle meat portion (only if not regular)
            if (key === 'meatPortion' && value !== 'regular') {
              const meatName = webhookItem.meat || 'meat';
              modifiers.push(`${meatName.charAt(0).toUpperCase() + meatName.slice(1)} (${value})`);
            }
            
            // Handle base ingredients (only if not regular)
            if (key === 'baseIngredients') {
              try {
                const baseIngredients = JSON.parse(value);
                Object.entries(baseIngredients).forEach(([ingredient, level]) => {
                  if (level !== 'regular') {
                    const formattedIngredient = ingredient.replace(/-/g, ' ')
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    modifiers.push(`${formattedIngredient} (${level})`);
                  }
                });
              } catch (e) {
                // If parsing fails, skip base ingredients
              }
            }
            
            // Handle other customizations (beans, sauce, tortilla, etc.)
            if (!['meat', 'meatPortion', 'baseIngredients'].includes(key)) {
              if (key === 'beans') {
                modifiers.push(`beans: ${value}`);
              } else if (key === 'sauce') {
                modifiers.push(value);
              } else if (key === 'tortilla') {
                modifiers.push(`tortilla: ${value}`);
              } else {
                modifiers.push(`${key}: ${value}`);
              }
            }
          }
        });
      }
      
      // Add extras if any
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach(extra => {
          modifiers.push(extra);
        });
      }
      
      // Only include modifiers if there are any
      if (modifiers.length > 0) {
        webhookItem.modifiers = modifiers;
      }
      
      return webhookItem;
    });
  };

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }
    
    // Generate daily resetting order number
    generateOrderNumber();
  }, [order, navigate]);

  const generateOrderNumber = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    
    // Get stored data from localStorage
    const storedData = localStorage.getItem('dailyOrderData');
    let orderData = { lastDate: '', lastOrderNumber: 0 };
    
    if (storedData) {
      try {
        orderData = JSON.parse(storedData);
      } catch (e) {
        // If parsing fails, use default values
        orderData = { lastDate: '', lastOrderNumber: 0 };
      }
    }
    
    // Check if it's a new day
    if (orderData.lastDate !== today) {
      // Reset to 1 for new day
      orderData.lastOrderNumber = 1;
      orderData.lastDate = today;
    } else {
      // Increment for same day
      orderData.lastOrderNumber += 1;
    }
    
    // Store updated data back to localStorage
    localStorage.setItem('dailyOrderData', JSON.stringify(orderData));
    
    // Set the order number (simple 1-4 digit number)
    setOrderNumber(orderData.lastOrderNumber.toString());
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (customerInfo.pickupOption === 'later' && !customerInfo.pickupTime) {
      newErrors.pickupTime = 'Please select a pickup time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Format order data for webhook
      const webhookData = {
        orderNumber,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        pickupOption: customerInfo.pickupOption,
        pickupTime: customerInfo.pickupTime || '',
        employee: employee?.name || 'Unknown',
        items: formatOrderForWebhook(order, customerInfo, orderNumber),
        totals: {
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total
        },
        timestamp: new Date().toISOString()
      };

      // Send to Make.com webhook
      const webhookResponse = await fetch('https://hook.us2.make.com/tlt96l40d3rn2o87sredp6ycpdqym0ob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!webhookResponse.ok) {
        throw new Error('Failed to send order to dashboard');
      }
      
      // Navigate to confirmation page with order details
      navigate('/order-confirmation', {
        state: {
          order,
          customerInfo,
          orderNumber,
          employee: employee?.name || 'Unknown'
        }
      });
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    // Navigate back to main page to update cart
    // This is a temporary solution - in a real app you'd want to use a global state manager
    navigate('/', { 
      state: { 
        updateCart: { itemId, newQuantity } 
      } 
    });
  };

  const formatCustomizationText = (text: string) => {
    // Split by colon to get key and value
    const [key, value] = text.split(':');
    
    // Format the key (convert camelCase to Title Case)
    const formatKey = (str: string) => {
      return str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim();
    };
    
    // Format the value (convert kebab-case and camelCase to Title Case)
    const formatValue = (str: string) => {
      return str
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
    };
    
    const formattedKey = formatKey(key?.trim() || '');
    const formattedValue = formatValue(value?.trim() || '');
    
    return `${formattedKey}: ${formattedValue}`;
  };

  if (!order) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header - Exact match to screenshot */}
      <div style={{ 
        backgroundColor: 'var(--accent-primary)', 
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={16} />
          Back to POS
        </button>
        
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: 'var(--bg-primary)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🌮
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'serif' }}>
            Epale Taqueria
          </span>
        </div>
        
        {/* Spacer for centering */}
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Main Content - Fixed 2-column layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 80px)',
        width: '100%'
      }}>
        {/* Left Side - Order Summary */}
        <div style={{ 
          padding: '48px',
          backgroundColor: 'var(--bg-primary)',
          borderRight: '1px solid var(--border-color)'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            color: 'var(--text-primary)',
            margin: '0 0 32px 0'
          }}>
            Order Summary
          </h1>
          
          <div style={{ marginBottom: '32px' }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ 
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0'
                    }}>
                      {item.name}
                    </h3>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: 'var(--text-primary)',
                      marginBottom: '12px'
                    }}>
                      ${item.basePrice.toFixed(2)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '4px'
                    }}>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: '600',
                        minWidth: '32px',
                        textAlign: 'center',
                        color: 'var(--text-primary)'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleQuantityUpdate(item.id, 0)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* Item customizations */}
                {item.customizations && item.customizations.split(';').filter(c => !c.includes('baseIngredients')).length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    {item.customizations.split(';')
                      .filter(customization => !customization.includes('baseIngredients'))
                      .map((customization, index) => (
                        <div key={index} style={{ 
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          marginBottom: '4px'
                        }}>
                          {formatCustomizationText(customization)}
                        </div>
                      ))}
                  </div>
                )}
                
                {item.extras.length > 0 && (
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ fontWeight: '500' }}>Extras: </span>
                    {item.extras.join(', ')} (+${item.extraTotal.toFixed(2)})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Customer Information */}
        <div style={{ 
          padding: '48px',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            color: 'var(--text-primary)',
            margin: '0 0 32px 0'
          }}>
            Customer Information
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Name Field */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--text-primary)'
              }}>
                Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                placeholder="Your full name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.name ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
              {errors.name && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--accent-primary)' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--text-primary)'
              }}>
                Phone Number <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '16px'
                }}>
                  📞
                </span>
                <input
                  type="tel"
                  value={customerInfo.phone || ''}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    borderRadius: '8px',
                    border: `1px solid var(--border-color)`,
                    fontSize: '16px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Pickup Options */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '12px',
                color: 'var(--text-primary)'
              }}>
                Pickup Options <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => setCustomerInfo({...customerInfo, pickupOption: 'now', pickupTime: ''})}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${customerInfo.pickupOption === 'now' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: customerInfo.pickupOption === 'now' ? 'var(--accent-primary-light)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>⏰</span>
                  <div style={{ fontWeight: '500' }}>Pick up now</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>(ASAP)</div>
                </button>
                
                <button
                  onClick={() => setCustomerInfo({...customerInfo, pickupOption: 'later'})}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${customerInfo.pickupOption === 'later' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: customerInfo.pickupOption === 'later' ? 'var(--accent-primary-light)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div style={{ fontWeight: '500' }}>Pick up later</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>(Schedule)</div>
                </button>
              </div>
              
              {customerInfo.pickupOption === 'later' && (
                <div style={{ marginTop: '12px' }}>
                  <input
                    type="datetime-local"
                    value={customerInfo.pickupTime}
                    onChange={(e) => setCustomerInfo({...customerInfo, pickupTime: e.target.value})}
                    min={new Date().toISOString().slice(0, 16)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.pickupTime ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      fontSize: '16px',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.pickupTime && (
                    <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--accent-primary)' }}>
                      {errors.pickupTime}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Notice */}
            <div style={{ 
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'var(--info-accent-light)',
              border: '1px solid var(--info-accent)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>🏪</span>
                <span style={{ fontWeight: '500', color: 'var(--info-accent)' }}>Payment in Store</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--info-accent)', margin: 0 }}>
                Payment will be collected when you pick up your order.
              </p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Processing...
                </>
              ) : (
                `🛒 Place Order • $${order.total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;