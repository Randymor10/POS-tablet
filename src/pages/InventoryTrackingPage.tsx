import React from 'react';
import { Package, AlertTriangle, TrendingDown, Plus } from 'lucide-react';
import KioskLayout from '../layout/KioskLayout';

const InventoryTrackingPage: React.FC = () => {
  // Mock inventory data - replace with real data from your backend
  const inventoryItems = [
    { id: 1, name: 'Tortillas (Large)', category: 'Ingredients', stock: 45, minStock: 20, unit: 'pcs', status: 'good' },
    { id: 2, name: 'Ground Beef', category: 'Meat', stock: 8, minStock: 10, unit: 'lbs', status: 'low' },
    { id: 3, name: 'Cheese (Shredded)', category: 'Dairy', stock: 3, minStock: 5, unit: 'lbs', status: 'critical' },
    { id: 4, name: 'Lettuce', category: 'Vegetables', stock: 12, minStock: 8, unit: 'heads', status: 'good' },
    { id: 5, name: 'Tomatoes', category: 'Vegetables', stock: 15, minStock: 10, unit: 'lbs', status: 'good' },
    { id: 6, name: 'Rice (Spanish)', category: 'Ingredients', stock: 25, minStock: 15, unit: 'lbs', status: 'good' },
    { id: 7, name: 'Black Beans', category: 'Ingredients', stock: 6, minStock: 8, unit: 'cans', status: 'low' },
    { id: 8, name: 'Sour Cream', category: 'Dairy', stock: 4, minStock: 6, unit: 'containers', status: 'low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
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

  const criticalItems = inventoryItems.filter(item => item.status === 'critical').length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low').length;
  const totalItems = inventoryItems.length;

  return (
    <KioskLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Inventory Tracking</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Stock</p>
                <p className="text-2xl font-bold text-gray-900">{criticalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actions Needed</p>
                <p className="text-2xl font-bold text-gray-900">{criticalItems + lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Plus size={16} />
              Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-green-600 hover:text-green-900">Restock</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </KioskLayout>
  );
};

export default InventoryTrackingPage;