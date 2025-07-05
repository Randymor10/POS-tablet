import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { menu } from '../data/menu';
import KioskLayout from '../layout/KioskLayout';
import './KioskMenuPage.css';

const KioskMenuPage = () => {
  const { isDark } = useTheme();
  const categories = Array.from(new Set(menu.map((m) => m.category)));
  const [active, setActive] = useState(categories[0]);

  return (
    <KioskLayout>
      <div className="category-tabs bg-bg-primary">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`category-tab ${cat === active ? 'active bg-accent-primary text-white' : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="items-grid bg-bg-primary">
        {menu
          .filter((item) => item.category === active)
          .map((item) => (
            <div key={item.id} className="item-card bg-bg-secondary border border-border-color rounded-lg p-4 hover:bg-bg-tertiary transition-colors">
              <div className="item-name text-text-primary font-bold mb-2">
                {item.name} - ${item.price.toFixed(2)}
              </div>
              <div className="item-desc text-text-secondary text-sm">{item.description}</div>
            </div>
          ))}
      </div>
    </KioskLayout>
  );
};

export default KioskMenuPage;
