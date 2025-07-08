import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Clock, Store, Minus, Plus, Trash2 } from 'lucide-react';
import { useEmployee } from '../contexts/EmployeeContext';
import type { OrderData } from '../utils/order';

interface CustomerInfo {
  name: string;
  email: string;
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
    email: '',
    phone: '',
    pickupOption: 'now',
    pickupTime: ''
  });
  
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }
    
    // Generate unique order number for today
    generateOrderNumber();
  }, [order, navigate]);

  const generateOrderNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = today.getTime().toString().slice(-4);
    const randomStr = Math.random().toString(36).substr(2, 3).toUpperCase();
    setOrderNumber(`${dateStr}-${timeStr}-${randomStr}`);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      // Simulate order submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        backgroundColor: '#c2410c', 
        color: 'white',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              color: 'white', 
              backgroundColor: 'transparent', 
              border: 'none', 
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ← Back to POS
          </button>
          <span style={{ color: '#9ca3af' }}>Menu</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: 'white', 
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '16px' }}>Order Online</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🛒 Cart</span>
            <span style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              1
            </span>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            📷
          </div>
        </div>
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
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            color: '#1f2937',
            margin: '0 0 32px 0'
          }}>
            Order Summary
          </h1>
          
          <div style={{ marginBottom: '32px' }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ 
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid #e5e7eb'
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
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    }}>
                      {item.name}
                    </h3>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: '#1f2937',
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
                      border: '1px solid #e5e7eb',
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
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
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
                        color: '#1f2937'
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
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
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
                        color: '#ef4444',
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
                {item.customizations && (
                  <div style={{ marginBottom: '12px' }}>
                    {item.customizations.split(';').map((customization, index) => (
                      <div key={index} style={{ 
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        {customization.split(':')[0]}: {customization.split(':')[1]?.trim()}
                      </div>
                    ))}
                  </div>
                )}
                
                {item.extras.length > 0 && (
                  <div style={{ 
                    fontSize: '14px',
                    color: '#6b7280'
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
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            color: '#1f2937',
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
                color: '#1f2937'
              }}>
                Name <span style={{ color: '#ef4444' }}>*</span>
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
                  border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  boxSizing: 'border-box'
                }}
              />
              {errors.name && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px',
                color: '#1f2937'
              }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px'
                }}>
                  ✉️
                </span>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    color: '#1f2937',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Pickup Options */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '12px',
                color: '#1f2937'
              }}>
                Pickup Options <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => setCustomerInfo({...customerInfo, pickupOption: 'now', pickupTime: ''})}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${customerInfo.pickupOption === 'now' ? '#ef4444' : '#d1d5db'}`,
                    backgroundColor: customerInfo.pickupOption === 'now' ? 'rgba(239, 68, 68, 0.1)' : 'white',
                    color: '#1f2937',
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
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>(ASAP)</div>
                </button>
                
                <button
                  onClick={() => setCustomerInfo({...customerInfo, pickupOption: 'later'})}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${customerInfo.pickupOption === 'later' ? '#ef4444' : '#d1d5db'}`,
                    backgroundColor: customerInfo.pickupOption === 'later' ? 'rgba(239, 68, 68, 0.1)' : 'white',
                    color: '#1f2937',
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
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>(Schedule)</div>
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
                      border: `1px solid ${errors.pickupTime ? '#ef4444' : '#d1d5db'}`,
                      fontSize: '16px',
                      backgroundColor: 'white',
                      color: '#1f2937',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.pickupTime && (
                    <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444' }}>
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
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>🏪</span>
                <span style={{ fontWeight: '500', color: '#f59e0b' }}>Payment in Store</span>
              </div>
              <p style={{ fontSize: '14px', color: '#f59e0b', margin: 0 }}>
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
                backgroundColor: '#fbbf24',
                color: '#1f2937',
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
                    border: '2px solid #1f2937',
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