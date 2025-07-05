import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { getAllSales, getSalesByEmployee } from '../utils/sales';
import { useEmployee } from '../contexts/EmployeeContext';
import KioskLayout from '../layout/KioskLayout';
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
      let salesData: SaleRecord[] = [];
      
      if (employee && (employee.role === 'manager' || employee.role === 'admin')) {
        salesData = await getAllSales();
      } else if (employee) {
        salesData = await getSalesByEmployee(employee.employee_id);
      }
      
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
    <KioskLayout>
      <div className="w-full max-w-none px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors shadow"
          >
            <ArrowLeft size={20} />
            Back to POS
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Sales Tracking</h1>
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-border-color shadow'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Sales</p>
                <p className="text-2xl font-bold text-text-primary">${totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Orders</p>
                <p className="text-2xl font-bold text-text-primary">{sales.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Avg Order Value</p>
                <p className="text-2xl font-bold text-text-primary">${averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Period</p>
                <p className="text-2xl font-bold text-text-primary capitalize">{filter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-bg-secondary rounded-lg shadow border border-border-color overflow-hidden">
          <div className="px-6 py-4 border-b border-border-color">
            <h2 className="text-lg font-semibold text-text-primary">Recent Sales</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-2 text-text-muted">Loading sales data...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              No sales found for the selected period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-color">
                <thead className="bg-bg-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-secondary divide-y divide-border-color">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-bg-tertiary">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {new Date(sale.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {sale.employee_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {sale.order_data.items.map((item: any) => (
                          <div key={item.id}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
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
    </KioskLayout>
  );
};

export default SalesTrackingPage;