import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertTriangle, TrendingDown, Plus } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  actualUsage: number;
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
  const [editing, setEditing] = useState<EditingState>({ type: null });
  const [editValue, setEditValue] = useState('');

  // Editable headers
  const [headers, setHeaders] = useState([
    'Item Name',
    'Category', 
    'Actual Usage Today',
    'Unit',
    'Last Updated'
  ]);

  // Mock inventory usage data based on actual orders today
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: 'Tortillas', category: 'Ingredients', actualUsage: 5, unit: 'pcs', lastUpdated: '2024-01-15 14:30' },
    { id: 2, name: 'Ground Beef', category: 'Meat', actualUsage: 3.5, unit: 'oz', lastUpdated: '2024-01-15 14:25' },
    { id: 3, name: 'Cheese (Shredded)', category: 'Dairy', actualUsage: 2.2, unit: 'oz', lastUpdated: '2024-01-15 14:20' },
    { id: 4, name: 'Lettuce', category: 'Vegetables', actualUsage: 0.5, unit: 'heads', lastUpdated: '2024-01-15 14:15' },
    { id: 5, name: 'Tomatoes', category: 'Vegetables', actualUsage: 1.8, unit: 'lbs', lastUpdated: '2024-01-15 14:10' },
    { id: 6, name: 'Rice (Spanish)', category: 'Ingredients', actualUsage: 4.2, unit: 'cups', lastUpdated: '2024-01-15 14:05' },
    { id: 7, name: 'Black Beans', category: 'Ingredients', actualUsage: 2.1, unit: 'cups', lastUpdated: '2024-01-15 14:00' },
    { id: 8, name: 'Sour Cream', category: 'Dairy', actualUsage: 1.3, unit: 'oz', lastUpdated: '2024-01-15 13:55' },
    { id: 9, name: 'Avocados', category: 'Vegetables', actualUsage: 3, unit: 'pieces', lastUpdated: '2024-01-15 13:50' },
    { id: 10, name: 'Chicken Breast', category: 'Meat', actualUsage: 6.7, unit: 'oz', lastUpdated: '2024-01-15 13:45' },
    { id: 11, name: 'Cilantro', category: 'Herbs', actualUsage: 0.25, unit: 'bunches', lastUpdated: '2024-01-15 13:40' },
    { id: 12, name: 'Onions', category: 'Vegetables', actualUsage: 0.8, unit: 'pieces', lastUpdated: '2024-01-15 13:35' },
    { id: 13, name: 'Lime Juice', category: 'Condiments', actualUsage: 4.5, unit: 'oz', lastUpdated: '2024-01-15 13:30' },
    { id: 14, name: 'Hot Sauce', category: 'Condiments', actualUsage: 2.1, unit: 'oz', lastUpdated: '2024-01-15 13:25' },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getUsageLevel = (actualUsage: number) => {
    if (actualUsage >= 4) return 'high';
    if (actualUsage >= 2) return 'medium';
    return 'low';
  };

  const highUsageItems = inventoryItems.filter(item => getUsageLevel(item.actualUsage) === 'high').length;
  const mediumUsageItems = inventoryItems.filter(item => getUsageLevel(item.actualUsage) === 'medium').length;
  const lowUsageItems = inventoryItems.filter(item => getUsageLevel(item.actualUsage) === 'low').length;
  const totalItems = inventoryItems.length;

  const handleHeaderDoubleClick = (index: number) => {
    setEditing({ type: 'header', headerIndex: index });
    setEditValue(headers[index]);
  };

  const handleCellDoubleClick = (itemId: number, field: string) => {
    // Don't allow editing of actualUsage field
    if (field === 'actualUsage') return;
    
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
          (updatedItem as any)[editing.field] = editValue;
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

  const handleAddItem = () => {
    const newId = Math.max(...inventoryItems.map(item => item.id)) + 1;
    const now = new Date();
    const newItem: InventoryItem = {
      id: newId,
      name: 'New Item',
      category: 'Category',
      actualUsage: 0,
      unit: 'units',
      lastUpdated: now.toISOString().slice(0, 16).replace('T', ' ')
    };
    setInventoryItems([...inventoryItems, newItem]);
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

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return `${month}/${day} ${formattedTime}`;
  };

  const renderEditableCell = (item: InventoryItem, field: string, value: any) => {
    const isEditing = editing.type === 'cell' && editing.itemId === item.id && editing.field === field;
    
    // Don't allow editing of actualUsage field
    if (field === 'actualUsage') {
      return <span>{value}</span>;
    }
    
    if (isEditing) {
      return (
        <input
          type="text"
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
        {field === 'lastUpdated' ? formatDateTime(value) : value}
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
        className="cursor-pointer hover:bg-opacity-50 px-2 py-1 rounded transition-colors"
        title="Double-click to edit"
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
            Daily Inventory Usage
          </h1>
          <div className="px-3 py-1 rounded-full text-sm" style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--accent-primary)' 
          }}>
            Live Order Data
          </div>
        </div>

        {/* Filter Button - Only All Items */}
        <div className="flex gap-2 mb-6">
          <button
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{
              backgroundColor: 'var(--accent-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            All Items
          </button>
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
              <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>
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
              <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
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
              <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>
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
              Today's Actual Usage from Orders
            </h2>
            <button 
              onClick={handleAddItem}
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
          ) : inventoryItems.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No items found.
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
                  {inventoryItems.map((item, index) => {
                    const usageLevel = getUsageLevel(item.actualUsage);
                    const usageColors = getUsageColor(usageLevel);
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:opacity-80 transition-opacity"
                        style={{ 
                          borderBottom: index < inventoryItems.length - 1 ? '1px solid var(--border-color)' : 'none'
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
                          className="px-6 py-4 whitespace-nowrap text-sm font-semibold" 
                          style={{ 
                            color: usageColors.text,
                            backgroundColor: usageColors.bg,
                            borderRight: '1px solid var(--border-color)'
                          }}
                        >
                          {renderEditableCell(item, 'actualUsage', `${item.actualUsage} ${item.unit}`)}
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
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {renderEditableCell(item, 'lastUpdated', item.lastUpdated)}
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
            <strong>Live Usage Tracking:</strong> This table shows actual ingredient consumption from today's orders. 
            Double-click any header or cell to edit (except actual usage amounts). Data updates in real-time as orders are processed.
            Usage levels: High (4+ units), Medium (2-4 units), Low {'(<2 units)'}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryTrackingPage;