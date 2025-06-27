import { useState } from 'react';
import { menu } from '../data/menu';
import KioskLayout from '../layout/KioskLayout';
import './KioskMenuPage.css';

const KioskMenuPage = () => {
  const categories = Array.from(new Set(menu.map((m) => m.category)));
  const [active, setActive] = useState(categories[0]);
  return (
    <KioskLayout>
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cat === active ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="items-grid">
        {menu
          .filter((item) => item.category === active)
          .map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-name">
                {item.name} - ${item.price.toFixed(2)}
              </div>
              <div className="item-desc">{item.description}</div>
            </div>
          ))}
      </div>
    </KioskLayout>
  );
};

export default KioskMenuPage;
