// src/pages/ReceiptPage.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { OrderData } from '../utils/order';

const ReceiptPage = () => {
  const location = useLocation();
  const order: OrderData = location.state?.order;

  if (!order) {
    return <p>No order to display.</p>;
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>🧾 Epale Taqueria</h2>
      <hr />
      {order.items.map((item) => (
        <div key={item.id} style={{ marginBottom: '8px' }}>
          {item.quantity}x {item.name} - ${item.basePrice.toFixed(2)}
          {item.extras.length > 0 && (
            <div style={{ marginLeft: '15px', fontSize: '0.9em' }}>
              + {item.extras.join(', ')} (+${item.extraTotal.toFixed(2)})
            </div>
          )}
        </div>
      ))}
      <hr />
      <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
      <p>Tax (9.25%): ${order.tax.toFixed(2)}</p>
      <p>
        <strong>Total: ${order.total.toFixed(2)}</strong>
      </p>
      <hr />
      <p style={{ textAlign: 'center' }}>Gracias por su orden 🙏</p>
    </div>
  );
};

export default ReceiptPage;
