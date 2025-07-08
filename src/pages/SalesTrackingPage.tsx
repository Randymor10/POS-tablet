import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { getAllSales, getSalesByEmployee } from '../utils/sales';
import { useEmployee } from '../contexts/EmployeeContext';
import type { SaleRecord } from '../utils/sales';

const SalesTrackingPage: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('today');
  
  const { employee } = useEmployee();
  const navigate = useNavigate();

  useEffect(() => {
    loadSales();
  }, [employee, filter]);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      // Use mock data for now
      const salesData = await getAllSales();
      
      // Apply date filter
      const now = new Date();
      const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.created_at);
        
        switch (filter) {
          case 'today':
            return saleDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return saleDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return saleDate >= monthAgo;
          default:
            return true;
        }
      });
      
      setSales(filteredSales);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const averageOrderValue = sales.length > 0 ? totalSales / sales.length : 0;

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
            Sales Tracking
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
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
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
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x" style={{ borderColor: 'var(--border-color)' }}>
            {/* Total Sales Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <DollarSign className="w-6 h-6" style={{ color: '#22c55e' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Total Sales
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${totalSales.toFixed(2)}
              </p>
            </div>

            {/* Orders Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--info-accent-light)' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--info-accent)' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Orders
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {sales.length}
              </p>
            </div>

            {/* Avg Order Value Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#a855f7' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Avg Order Value
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="rounded-lg shadow overflow-hidden" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Sales
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--accent-primary)' }}></div>
              <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Loading sales data...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No sales found for the selected period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {sales.map((sale, index) => (
                    <tr 
                      key={sale.id} 
                      className="hover:opacity-80 transition-opacity"
                      style={{ 
                        borderBottom: index < sales.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                        {new Date(sale.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                        {sale.employee_id}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                        {sale.order_data.items.map((item: any) => (
                          <div key={item.id}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        ${sale.total_amount.toFixed(2)}
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

export default SalesTrackingPage;