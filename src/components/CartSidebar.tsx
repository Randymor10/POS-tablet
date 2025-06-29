import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { OrderData } from '../utils/order';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateQuantity,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>
            <ShoppingBag size={20} />
            Your Order
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-content">
          {order.items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>Your cart is empty</p>
              <span>Add items to get started</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {order.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">${item.basePrice.toFixed(2)}</p>
                      {item.extras.length > 0 && (
                        <div className="cart-item-extras">
                          + {item.extras.join(', ')} (+${item.extraTotal.toFixed(2)})
                        </div>
                      )}
                    </div>
                    
                    <div className="quantity-controls">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Tax (9.25%)</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <button className="checkout-button" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;