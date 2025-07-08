import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Clock, Store, Minus, Plus, Trash2 } from 'lucide-react';
import { useEmployee } from '../contexts/EmployeeContext';
import PageLayout from '../layout/PageLayout';
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

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <PageLayout 
      pageTitle="Checkout" 
      showBackButton={true} 
      onBackClick={handleBackToMenu}
    >
      <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Side - Order Summary */}
          <div className="p-8 space-y-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Order Summary
              </h1>
              <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                color: '#22c55e' 
              }}>
                Order #{orderNumber}
              </div>
            </div>
            
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {item.name}
                      </h3>
                      <div className="text-lg font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>
                        ${item.basePrice.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg p-1" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                          style={{ 
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-semibold min-w-[2rem] text-center" style={{ color: 'var(--text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                          style={{ 
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, 0)}
                        className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-red-100"
                        style={{ color: '#ef4444' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {item.customizations && (
                    <div className="space-y-2 mb-4">
                      {item.customizations.split(';').map((customization, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span className="font-medium">{customization.split(':')[0]}:</span>
                          <span>{customization.split(':')[1]?.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {item.extras.length > 0 && (
                    <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium">Extras: </span>
                      {item.extras.join(', ')} (+${item.extraTotal.toFixed(2)})
                    </div>
                  )}
                </div>
              ))}
              
              {/* Order Totals */}
              <div className="pt-6 space-y-3" style={{ borderTop: '2px solid var(--border-color)' }}>
                <div className="flex justify-between text-lg">
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-primary)' }}>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span style={{ color: 'var(--text-secondary)' }}>Tax (9.25%)</span>
                  <span style={{ color: 'var(--text-primary)' }}>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3" style={{ 
                  borderTop: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}>
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Customer Information */}
          <div className="p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
              Customer Information
            </h2>
            
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-lg"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: errors.name ? 'var(--accent-primary)' : 'var(--border-color)'
                    }}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--accent-primary)' }}>{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-lg"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: errors.email ? 'var(--accent-primary)' : 'var(--border-color)'
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--accent-primary)' }}>{errors.email}</p>
                )}
              </div>

              {/* Phone Field (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Phone Number <span className="text-sm" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg border text-lg"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
              </div>

              {/* Pickup Options */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Pickup Options <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCustomerInfo({...customerInfo, pickupOption: 'now', pickupTime: ''})}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      customerInfo.pickupOption === 'now' ? 'border-red-400' : 'hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: customerInfo.pickupOption === 'now' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-primary)',
                      borderColor: customerInfo.pickupOption === 'now' ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Pick up now</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>(ASAP)</div>
                  </button>
                  
                  <button
                    onClick={() => setCustomerInfo({...customerInfo, pickupOption: 'later'})}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      customerInfo.pickupOption === 'later' ? 'border-red-400' : 'hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: customerInfo.pickupOption === 'later' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-primary)',
                      borderColor: customerInfo.pickupOption === 'later' ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Pick up later</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>(Schedule)</div>
                  </button>
                </div>
                
                {customerInfo.pickupOption === 'later' && (
                  <div className="mt-3">
                    <input
                      type="datetime-local"
                      value={customerInfo.pickupTime}
                      onChange={(e) => setCustomerInfo({...customerInfo, pickupTime: e.target.value})}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 rounded-lg border text-lg"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        borderColor: errors.pickupTime ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    />
                    {errors.pickupTime && (
                      <p className="mt-1 text-sm" style={{ color: 'var(--accent-primary)' }}>{errors.pickupTime}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Notice */}
              <div className="p-4 rounded-lg" style={{ 
                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                border: '1px solid rgba(245, 158, 11, 0.2)' 
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <span className="font-medium" style={{ color: '#f59e0b' }}>Payment in Store</span>
                </div>
                <p className="text-sm" style={{ color: '#f59e0b' }}>
                  Payment will be collected when you pick up your order.
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white'
                }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order • $${order.total.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutPage;