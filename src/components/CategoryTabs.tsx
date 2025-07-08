import React from 'react';
import { Star } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const allCategories = ['Popular', ...categories];

  return (
    <div className="category-tabs" style={{ padding: '0 2rem' }}>
      {allCategories.map((category) => (
        <button
          key={category}
          className={`category-tab ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category === 'Popular' && <Star size={16} />}
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;