import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertTriangle, TrendingDown, Plus, Edit, RefreshCw } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  dailyUsage: number;
  weeklyUsage: number;
  monthlyUsage: number;
  unit: string;
  lastUpdated: string;
}

interface EditingState {
  type: 'header' | 'cell' | null;
  headerIndex?: number;
  itemId?: number;
  field?: string;
}

const InventoryTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [editing, setEditing] = useState<EditingState>({ type: null });
  const [editValue, setEditValue] = useState('');

  // Editable headers
  const [headers, setHeaders] = useState([
    'Item Name',
    'Category', 
    'Daily Usage',
    'Weekly Usage',
    'Monthly Usage',
    'Unit',
    'Last Updated',
    'Actions'
  ]);

  // Mock inventory usage data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: 'Tortillas', category: 'Ingredients', dailyUsage: 45, weeklyUsage: 315, monthlyUsage: 1350, unit: 'pcs', lastUpdated: '2024-01-15' },
    { id: 2, name: 'Ground Beef', category: 'Meat', dailyUsage: 8, weeklyUsage: 56, monthlyUsage: 240, unit: 'lbs', lastUpdated: '2024-01-15' },
    { id: 3, name: 'Cheese (Shredded)', category: 'Dairy', dailyUsage: 12, weeklyUsage: 84, monthlyUsage: 360, unit: 'lbs', lastUpdated: '2024-01-15' },
    { id: 4, name: 'Lettuce', category: 'Vegetables', dailyUsage: 6, weeklyUsage: 42, monthlyUsage: 180, unit: 'heads', lastUpdated: '2024-01-15' },
    { id: 5, name: 'Tomatoes', category: 'Vegetables', dailyUsage: 10, weeklyUsage: 70, monthlyUsage: 300, unit: 'lbs', lastUpdated: '2024-01-15' },
    { id: 6, name: 'Rice (Spanish)', category: 'Ingredients', dailyUsage: 15, weeklyUsage: 105, monthlyUsage: 450, unit: 'lbs', lastUpdated: '2024-01-15' },
    { id: 7, name: 'Black Beans', category: 'Ingredients', dailyUsage: 8, weeklyUsage: 56, monthlyUsage: 240, unit: 'cans', lastUpdated: '2024-01-15' },
    { id: 8, name: 'Sour Cream', category: 'Dairy', dailyUsage: 4, weeklyUsage: 28, monthlyUsage: 120, unit: 'containers', lastUpdated: '2024-01-15' },
    { id: 9, name: 'Avocados', category: 'Vegetables', dailyUsage: 20, weeklyUsage: 140, monthlyUsage: 600, unit: 'pieces', lastUpdated: '2024-01-15' },
    { id: 10, name: 'Chicken Breast', category: 'Meat', dailyUsage: 12, weeklyUsage: 84, monthlyUsage: 360, unit: 'lbs', lastUpdated: '2024-01-15' },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getUsageLevel = (dailyUsage: number) => {
    if (dailyUsage >= 15) return 'high';
    if (dailyUsage >= 8) return 'medium';
    return 'low';
  };

  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'all') return true;
    return getUsageLevel(item.dailyUsage) === filter;
  });

  const highUsageItems = inventoryItems.filter(item => getUsageLevel(item.dailyUsage) === 'high').length;
  const mediumUsageItems = inventoryItems.filter(item => getUsageLevel(item.dailyUsage) === 'medium').length;
  const lowUsageItems = inventoryItems.filter(item => getUsageLevel(item.dailyUsage) === 'low').length;
  const totalItems = inventoryItems.length;

  const handleHeaderDoubleClick = (index: number) => {
    if (index === headers.length - 1) return; // Don't edit Actions column
    setEditing({ type: 'header', headerIndex: index });
    setEditValue(headers[index]);
  };

  const handleCellDoubleClick = (itemId: number, field: string) => {
    if (field === 'actions') return; // Don't edit actions
    setEditing({ type: 'cell', itemId, field });
    const item = inventoryItems.find(i => i.id === itemId);
    if (item) {
      setEditValue(String(item[field as keyof InventoryItem]));
    }
  };

  const handleEditSave = () => {
    if (editing.type === 'header' && editing.headerIndex !== undefined) {
      const newHeaders = [...headers];
      newHeaders[editing.headerIndex] = editValue;
      setHeaders(newHeaders);
    } else if (editing.type === 'cell' && editing.itemId && editing.field) {
      const newItems = inventoryItems.map(item => {
        if (item.id === editing.itemId) {
          const updatedItem = { ...item };
          if (editing.field === 'dailyUsage' || editing.field === 'weeklyUsage' || editing.field === 'monthlyUsage') {
            updatedItem[editing.field] = parseInt(editValue) || 0;
          } else {
            (updatedItem as any)[editing.field] = editValue;
          }
          return updatedItem;
        }
        return item;
      });
      setInventoryItems(newItems);
    }
    setEditing({ type: null });
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditing({ type: null });
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const getUsageColor = (level: string) => {
    switch (level) {
      case 'high':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
      case 'medium':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
      default:
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' };
    }
  };

  const renderEditableCell = (item: InventoryItem, field: string, value: any) => {
    const isEditing = editing.type === 'cell' && editing.itemId === item.id && editing.field === field;
    
    if (isEditing) {
      return (
        <input
          type={field.includes('Usage') ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 text-sm border rounded"
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '2px solid var(--accent-primary)'
          }}
          autoFocus
        />
      );
    }

    return (
      <span
        onDoubleClick={() => handleCellDoubleClick(item.id, field)}
        className="cursor-pointer hover:bg-opacity-50 px-2 py-1 rounded transition-colors"
        style={{ backgroundColor: 'transparent' }}
        title="Double-click to edit"
      >
        {value}
      </span>
    );
  };

  const renderEditableHeader = (header: string, index: number) => {
    const isEditing = editing.type === 'header' && editing.headerIndex === index;
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 text-xs font-medium uppercase tracking-wider border rounded"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '2px solid var(--accent-primary)'
          }}
          autoFocus
        />
      );
    }

    return (
      <span
        onDoubleClick={() => handleHeaderDoubleClick(index)}
        className={`cursor-pointer hover:bg-opacity-50 px-2 py-1 rounded transition-colors ${index === headers.length - 1 ? 'cursor-default' : ''}`}
        title={index === headers.length - 1 ? '' : "Double-click to edit"}
      >
        {header}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto p-4">
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
            Inventory Usage Tracking
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
            { key: 'high', label: 'High Usage' },
            { key: 'medium', label: 'Medium Usage' },
            { key: 'low', label: 'Low Usage' },
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

            {/* High Usage Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                High Usage
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {highUsageItems}
              </p>
            </div>

            {/* Medium Usage Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <TrendingDown className="w-6 h-6" style={{ color: '#f59e0b' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Medium Usage
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {mediumUsageItems}
              </p>
            </div>

            {/* Low Usage Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <Package className="w-6 h-6" style={{ color: '#22c55e' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Low Usage
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lowUsageItems}
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Usage Table */}
        <div className="rounded-lg shadow overflow-hidden" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Usage Tracking - Editable Table
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
              <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Loading usage data...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No items found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <tr>
                    {headers.map((header, index) => (
                      <th 
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: 'var(--text-muted)',
                          borderBottom: '2px solid var(--border-color)',
                          borderRight: index < headers.length - 1 ? '1px solid var(--border-color)' : 'none'
                        }}
                      >
                        {renderEditableHeader(header, index)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {filteredItems.map((item, index) => {
                    const usageLevel = getUsageLevel(item.dailyUsage);
                    const usageColors = getUsageColor(usageLevel);
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:opacity-80 transition-opacity"
                        style={{ 
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                          style={{ 
                            color: 'var(--text-primary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'name', item.name)}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm" 
                          style={{ 
                            color: 'var(--text-secondary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'category', item.category)}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm" 
                          style={{ 
                            color: 'var(--text-primary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'dailyUsage', `${item.dailyUsage} ${item.unit}`)}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm" 
                          style={{ 
                            color: 'var(--text-primary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'weeklyUsage', `${item.weeklyUsage} ${item.unit}`)}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm" 
                          style={{ 
                            color: 'var(--text-primary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'monthlyUsage', `${item.monthlyUsage} ${item.unit}`)}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm" 
                          style={{ 
                            color: 'var(--text-secondary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'unit', item.unit)}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm" 
                          style={{ 
                            color: 'var(--text-secondary)',
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'lastUpdated', item.lastUpdated)}
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
                              title="Update usage"
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

        <div className="mt-4 p-4 rounded-lg" style={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.2)' 
        }}>
          <p className="text-sm" style={{ color: '#3b82f6' }}>
            <strong>Interactive Table:</strong> Double-click on any header or cell to edit. Press Enter to save or Escape to cancel. 
            This table tracks daily, weekly, and monthly usage patterns for inventory planning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryTrackingPage;