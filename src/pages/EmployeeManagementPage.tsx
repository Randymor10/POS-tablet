import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Users, UserCheck, UserX } from 'lucide-react';

interface MockEmployee {
  id: string;
  employee_id: string;
  name: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

const EmployeeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock employee data
  const [employees] = useState<MockEmployee[]>([
    {
      id: '1',
      employee_id: 'EMP001',
      name: 'John Manager',
      role: 'manager',
      created_at: '2024-01-15T10:00:00Z',
      is_active: true
    },
    {
      id: '2',
      employee_id: 'EMP002',
      name: 'Jane Cashier',
      role: 'cashier',
      created_at: '2024-01-20T10:00:00Z',
      is_active: true
    },
    {
      id: '3',
      employee_id: 'EMP003',
      name: 'Mike Admin',
      role: 'admin',
      created_at: '2024-01-10T10:00:00Z',
      is_active: true
    },
    {
      id: '4',
      employee_id: 'CASH01',
      name: 'Sarah Johnson',
      role: 'cashier',
      created_at: '2024-02-01T10:00:00Z',
      is_active: false
    }
  ]);

  const activeEmployees = employees.filter(emp => emp.is_active).length;
  const inactiveEmployees = employees.filter(emp => !emp.is_active).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={20} />
            Back to POS
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            Using Mock Data
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveEmployees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              <Plus size={16} />
              Add Employee (Disabled)
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        employee.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(employee.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          disabled
                          className="text-gray-400 cursor-not-allowed"
                          title="Edit disabled in demo mode"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          disabled
                          className="text-gray-400 cursor-not-allowed"
                          title="Toggle status disabled in demo mode"
                        >
                          {employee.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          disabled
                          className="text-gray-400 cursor-not-allowed"
                          title="Delete disabled in demo mode"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Demo Mode:</strong> This page is displaying mock data. In a production environment, 
            this would connect to your employee database and allow full CRUD operations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementPage;