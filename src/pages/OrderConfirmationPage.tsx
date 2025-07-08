import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, Store, User, Mail, Phone, Download } from 'lucide-react';
import PageLayout from '../layout/PageLayout';
import type { OrderData } from '../utils/order';

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  pickupOption: 'now' | 'later';
  pickupTime?: string;
}

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const order: OrderData = location.state?.order;
  const customerInfo: CustomerInfo = location.state?.customerInfo;
  const orderNumber: string = location.state?.orderNumber;
  const employeeName: string = location.state?.employee;

  if (!order || !customerInfo || !orderNumber) {
    navigate('/');
    return null;
  }

  const estimatedTime = customerInfo.pickupOption === 'now' ? '15-20 minutes' : 'Scheduled time';

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleNewOrder = () => {
    navigate('/');
  };

  return (
    <PageLayout 
      pageTitle="Order Confirmation" 
      showBackButton={true} 
      onBackClick={handleNewOrder}
    >
      <div className="w-full">

        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#22c55e' }} />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Order Placed Successfully!
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Thank you for your order. We'll have it ready for pickup soon.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-lg shadow-lg overflow-hidden mb-6" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Order Header */}
          <div className="px-6 py-4" style={{ 
            backgroundColor: 'var(--accent-primary)',
            color: 'white'
          }}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Order #{orderNumber}</h3>
                <p className="text-red-100">Processed by: {employeeName}</p>
              </div>
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              >
                <Download size={16} />
                Print Receipt
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{customerInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{customerInfo.email}</span>
                  </div>
                  {customerInfo.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{customerInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Pickup Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ color: 'var(--text-primary)' }}>
                        {customerInfo.pickupOption === 'now' ? 'ASAP' : 'Scheduled'}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {customerInfo.pickupOption === 'now' 
                          ? `Ready in ${estimatedTime}`
                          : `Pickup at ${new Date(customerInfo.pickupTime!).toLocaleString()}`
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ color: 'var(--text-primary)' }}>Epale Taqueria</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Payment due at pickup
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-lg shadow overflow-hidden mb-6" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Order Items
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                      ${item.itemTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {item.customizations && (
                    <div className="text-sm space-y-1 mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {item.customizations.split(';').map((customization, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }}></span>
                          <span>{customization.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {item.extras.length > 0 && (
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium">Extras: </span>
                      {item.extras.join(', ')} (+${item.extraTotal.toFixed(2)})
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Order Total */}
            <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex justify-between text-lg">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ color: 'var(--text-primary)' }}>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span style={{ color: 'var(--text-secondary)' }}>Tax (9.25%)</span>
                <span style={{ color: 'var(--text-primary)' }}>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-2" style={{ 
                borderTop: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}>
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg p-6" style={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.2)' 
        }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#3b82f6' }}>
            What's Next?
          </h3>
          <div className="space-y-2 text-sm" style={{ color: '#3b82f6' }}>
            <p>• We'll start preparing your order right away</p>
            <p>• You'll receive an email confirmation shortly</p>
            <p>• Come to the restaurant when your order is ready</p>
            <p>• Payment will be collected at pickup</p>
            <p>• Show this order number: <strong>#{orderNumber}</strong></p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderConfirmationPage;