import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface InventoryUsageRecord {
  id: number;
  item_name: string;
  category: string;
  usage_amount: number;
  unit: string;
  date_recorded: string;
  employee_id?: string;
}

const InventoryTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');

  // Mock usage data - showing daily usage records
  const [usageRecords] = useState<InventoryUsageRecord[]>([
    { id: 1, item_name: 'Tortillas (Large)', category: 'Ingredients', usage_amount: 25, unit: 'pcs', date_recorded: new Date().toISOString(), employee_id: 'EMP001' },
    { id: 2, item_name: 'Ground Beef', category: 'Meat', usage_amount: 3.5, unit: 'lbs', date_recorded: new Date().toISOString(), employee_id: 'EMP002' },
    { id: 3, item_name: 'Cheese (Shredded)', category: 'Dairy', usage_amount: 2.2, unit: 'lbs', date_recorded: new Date().toISOString(), employee_id: 'EMP001' },
    { id: 4, item_name: 'Lettuce', category: 'Vegetables', usage_amount: 4, unit: 'heads', date_recorded: new Date().toISOString(), employee_id: 'EMP003' },
    { id: 5, item_name: 'Tomatoes', category: 'Vegetables', usage_amount: 6.8, unit: 'lbs', date_recorded: new Date().toISOString(), employee_id: 'EMP002' },
    { id: 6, item_name: 'Rice (Spanish)', category: 'Ingredients', usage_amount: 8.5, unit: 'lbs', date_recorded: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP001' },
    { id: 7, item_name: 'Black Beans', category: 'Ingredients', usage_amount: 12, unit: 'cans', date_recorded: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP002' },
    { id: 8, item_name: 'Sour Cream', category: 'Dairy', usage_amount: 3, unit: 'containers', date_recorded: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP003' },
    { id: 9, item_name: 'Avocados', category: 'Vegetables', usage_amount: 18, unit: 'pieces', date_recorded: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP001' },
    { id: 10, item_name: 'Chicken Breast', category: 'Meat', usage_amount: 5.2, unit: 'lbs', date_recorded: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP002' },
    { id: 11, item_name: 'Tortillas (Large)', category: 'Ingredients', usage_amount: 30, unit: 'pcs', date_recorded: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP003' },
    { id: 12, item_name: 'Ground Beef', category: 'Meat', usage_amount: 4.1, unit: 'lbs', date_recorded: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), employee_id: 'EMP001' },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getFilteredRecords = () => {
    const now = new Date();
    return usageRecords.filter(record => {
      const recordDate = new Date(record.date_recorded);
      
      switch (filter) {
        case 'daily':
          return recordDate.toDateString() === now.toDateString();
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return recordDate >= weekAgo;
        case 'monthly':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return recordDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredRecords = getFilteredRecords();
  const totalUsageRecords = filteredRecords.length;
  const totalItems = new Set(filteredRecords.map(record => record.item_name)).size;
  const averageDailyUsage = filteredRecords.length > 0 ? filteredRecords.length / Math.max(1, filter === 'daily' ? 1 : filter === 'weekly' ? 7 : 30) : 0;
  
  // Find most used item
  const itemUsageCounts = filteredRecords.reduce((acc, record) => {
    acc[record.item_name] = (acc[record.item_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedItem = Object.entries(itemUsageCounts).reduce((max, [item, count]) => 
    count > max.count ? { item, count } : max, { item: 'None', count: 0 }
  );

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
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' },
            { key: 'all', label: 'All Time' },
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
            {/* Total Usage Records Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <BarChart3 className="w-6 h-6" style={{ color: '#3b82f6' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Usage Records
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalUsageRecords}
              </p>
            </div>

            {/* Unique Items Used Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <Package className="w-6 h-6" style={{ color: '#22c55e' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Items Used
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalItems}
              </p>
            </div>

            {/* Average Daily Usage Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#a855f7' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Avg Daily Usage
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {averageDailyUsage.toFixed(1)}
              </p>
            </div>

            {/* Most Used Item Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#f59e0b' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Most Used Item
              </h3>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {mostUsedItem.item.length > 15 ? mostUsedItem.item.substring(0, 15) + '...' : mostUsedItem.item}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                ({mostUsedItem.count} times)
              </p>
            </div>
          </div>
        </div>

        {/* Usage Records Table */}
        <div className="rounded-lg shadow overflow-hidden" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Usage Records
            </h2>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none'
              }}
            >
              <Package size={16} />
              Record Usage
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--accent-primary)' }}></div>
              <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Loading usage data...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No usage records found for the selected period.
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
                      Usage Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Date Recorded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Employee
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {filteredRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className="hover:opacity-80 transition-opacity"
                      style={{ 
                        borderBottom: index < filteredRecords.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {record.item_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {record.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                        {record.usage_amount} {record.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(record.date_recorded).toLocaleDateString()} {new Date(record.date_recorded).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                        {record.employee_id || 'N/A'}
                      </td>
                    </tr>
                  ))}
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