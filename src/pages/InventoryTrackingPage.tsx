import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertTriangle, TrendingDown, Plus, Edit, RefreshCw } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  current_stock: number;
  min_stock: number;
  unit: string;
  cost_per_unit?: number;
  supplier?: string;
  last_restocked?: string;
  status: 'good' | 'low' | 'critical';
}

const InventoryTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'low' | 'good'>('all');

  // Mock inventory data
  const [inventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: 'Tortillas (Large)', category: 'Ingredients', current_stock: 45, min_stock: 20, unit: 'pcs', cost_per_unit: 0.25, supplier: 'Local Bakery', status: 'good' },
    { id: 2, name: 'Ground Beef', category: 'Meat', current_stock: 8, min_stock: 10, unit: 'lbs', cost_per_unit: 6.50, supplier: 'Meat Co.', status: 'low' },
    { id: 3, name: 'Cheese (Shredded)', category: 'Dairy', current_stock: 3, min_stock: 5, unit: 'lbs', cost_per_unit: 4.25, supplier: 'Dairy Farm', status: 'critical' },
    { id: 4, name: 'Lettuce', category: 'Vegetables', current_stock: 12, min_stock: 8, unit: 'heads', cost_per_unit: 1.50, supplier: 'Fresh Produce', status: 'good' },
    { id: 5, name: 'Tomatoes', category: 'Vegetables', current_stock: 15, min_stock: 10, unit: 'lbs', cost_per_unit: 2.75, supplier: 'Fresh Produce', status: 'good' },
    { id: 6, name: 'Rice (Spanish)', category: 'Ingredients', current_stock: 25, min_stock: 15, unit: 'lbs', cost_per_unit: 1.80, supplier: 'Grain Supply', status: 'good' },
    { id: 7, name: 'Black Beans', category: 'Ingredients', current_stock: 6, min_stock: 8, unit: 'cans', cost_per_unit: 1.25, supplier: 'Canned Goods Co.', status: 'low' },
    { id: 8, name: 'Sour Cream', category: 'Dairy', current_stock: 4, min_stock: 6, unit: 'containers', cost_per_unit: 3.50, supplier: 'Dairy Farm', status: 'low' },
    { id: 9, name: 'Avocados', category: 'Vegetables', current_stock: 2, min_stock: 12, unit: 'pieces', cost_per_unit: 1.25, supplier: 'Fresh Produce', status: 'critical' },
    { id: 10, name: 'Chicken Breast', category: 'Meat', current_stock: 18, min_stock: 15, unit: 'lbs', cost_per_unit: 5.99, supplier: 'Meat Co.', status: 'good' },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const criticalItems = inventoryItems.filter(item => item.status === 'critical').length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low').length;
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.current_stock * (item.cost_per_unit || 0)), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
      case 'low':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
      default:
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            <ArrowLeft size={20} />
            Back to POS
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Inventory Tracking
          </h1>
          <div className="px-3 py-1 rounded-full text-sm" style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--accent-primary)' 
          }}>
            Using Mock Data
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All Items' },
            { key: 'critical', label: 'Critical' },
            { key: 'low', label: 'Low Stock' },
            { key: 'good', label: 'Good Stock' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === key
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: filter === key ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: filter === key ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="rounded-lg shadow overflow-hidden mb-6" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x" style={{ borderColor: 'var(--border-color)' }}>
            {/* Total Items Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <Package className="w-6 h-6" style={{ color: '#3b82f6' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Total Items
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalItems}
              </p>
            </div>

            {/* Critical Stock Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Critical Stock
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {criticalItems}
              </p>
            </div>

            {/* Low Stock Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <TrendingDown className="w-6 h-6" style={{ color: '#f59e0b' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Low Stock
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lowStockItems}
              </p>
            </div>

            {/* Total Value Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <Package className="w-6 h-6" style={{ color: '#22c55e' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Total Value
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-lg shadow overflow-hidden" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Inventory Items
            </h2>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none'
              }}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--accent-primary)' }}></div>
              <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Loading inventory data...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No items found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Min Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Cost/Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {filteredItems.map((item, index) => {
                    const statusColors = getStatusColor(item.status);
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:opacity-80 transition-opacity"
                        style={{ 
                          borderBottom: index < filteredItems.length - 1 ? '1px solid var(--border-color)' : 'none'
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                          {item.current_stock} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {item.min_stock} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: statusColors.bg,
                              color: statusColors.text
                            }}
                          >
                            {getStatusIcon(item.status)}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                          ${item.cost_per_unit?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button 
                              className="transition-colors"
                              style={{ color: '#3b82f6' }}
                              title="Edit item"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="transition-colors"
                              style={{ color: '#22c55e' }}
                              title="Restock item"
                            >
                              <RefreshCw size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryTrackingPage;