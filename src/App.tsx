// src/App.tsx
import { useState } from 'react';
import { menu } from './data/menu';
import type { MenuItem } from './data/menu';
import { EXTRA_PRICES } from './utils/extras';
import { getOrderData } from './utils/order';
import './kiosk.css';

interface CartItem extends MenuItem {
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, string[]>>({});

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

  const categories = Array.from(new Set(menu.map((m) => m.category)));

  return (
    <div className="kiosk-layout">
      <header className="kiosk-header">🌮 Epale Taqueria POS</header>
      <div className="kiosk-container">
        <div className="menu-area">
          {categories.map((cat) => (
            <section key={cat} className="category-section">
              <h2>{cat}</h2>
              <div className="items-grid">
                {menu
                  .filter((item) => item.category === cat)
                  .map((item: MenuItem) => (
                    <div key={item.id} className="item-card">
                      <div className="item-image" />
                      <div className="item-name">
                        {item.name} - ${item.price.toFixed(2)}
                      </div>
                      <div className="item-desc">{item.description}</div>
                      <div className="extras">
                        <details>
                          <summary>Extras</summary>
                          <div>
                            {Object.keys(EXTRA_PRICES).map((extra) => (
                              <label key={extra} style={{ display: 'block' }}>
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedExtras[item.id]?.includes(extra) || false
                                  }
                                  onChange={() => toggleExtra(item.id, extra)}
                                />{' '}
                                {extra} (+${EXTRA_PRICES[extra].toFixed(2)})
                              </label>
                            ))}
                          </div>
                        </details>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => addToCart(item)}>Add to Cart</button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="cart-panel">
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p>No items yet.</p>
          ) : (
            <>
              {order.items.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.quantity}x {item.name}
                  {item.extras.length > 0 && (
                    <div style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>
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
              <button onClick={handlePrintOrder}>📦 Log Order to Console</button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
