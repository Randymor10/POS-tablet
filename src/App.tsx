// src/App.tsx
import React, { useState } from 'react';
import { menu, MenuItem } from './data/menu';
import { EXTRA_PRICES } from './utils/extras';
import { getOrderData } from './utils/order';

interface CartItem extends MenuItem {
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<
    Record<string, string[]>
  >({});

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const toggleExtra = (itemId: string, extra: string) => {
    setSelectedExtras((prev) => {
      const currentExtras = prev[itemId] || [];
      const updated = currentExtras.includes(extra)
        ? currentExtras.filter((e) => e !== extra)
        : [...currentExtras, extra];
      return { ...prev, [itemId]: updated };
    });
  };

  const handlePrintOrder = () => {
    const order = getOrderData(cart, selectedExtras);
    console.log('🧾 Order:', order);
    alert('Order logged to console!');
  };

  const order = getOrderData(cart, selectedExtras);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🌮 Epale Taqueria POS</h1>

      <h2 style={{ marginTop: '30px' }}>Menu</h2>
      {menu.map((item: MenuItem) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <h3>
            {item.name} - ${item.price.toFixed(2)}
          </h3>
          <p>{item.description}</p>

          <div>
            <strong>Extras:</strong>
            {Object.keys(EXTRA_PRICES).map((extra) => (
              <label key={extra} style={{ marginRight: '10px' }}>
                <input
                  type="checkbox"
                  checked={selectedExtras[item.id]?.includes(extra) || false}
                  onChange={() => toggleExtra(item.id, extra)}
                />
                {extra} (+${EXTRA_PRICES[extra].toFixed(2)})
              </label>
            ))}
          </div>

          <button onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
      ))}

      <h2 style={{ marginTop: '30px' }}>🛒 Cart</h2>
      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div>
          {order.items.map((item) => (
            <div key={item.id} style={{ marginBottom: '10px' }}>
              {item.quantity}x {item.name} – ${item.basePrice * item.quantity}
              {item.extras.length > 0 && (
                <div style={{ fontSize: '0.9em', marginLeft: '15px' }}>
                  + Extras: {item.extras.join(', ')} (+$
                  {item.extraTotal.toFixed(2)})
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
          <button onClick={handlePrintOrder}>📦 Log Order to Console</button>
        </div>
      )}
    </div>
  );
}

export default App;
