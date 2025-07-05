import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Users, UserCheck, UserX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import KioskLayout from '../layout/KioskLayout';
import type { Employee } from '../lib/supabase';

const EmployeeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    name: '',
    passcode: '',
    role: 'cashier'
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading employees:', error);
        return;
      }

      setEmployees(data || []);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.employee_id || !newEmployee.name || !newEmployee.passcode) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .insert({
          employee_id: newEmployee.employee_id,
          name: newEmployee.name,
          passcode: newEmployee.passcode,
          role: newEmployee.role,
          is_active: true
        });

      if (error) {
        console.error('Error adding employee:', error);
        alert('Failed to add employee. Employee ID might already exist.');
        return;
      }

      setNewEmployee({ employee_id: '', name: '', passcode: '', role: 'cashier' });
      setIsAddModalOpen(false);
      loadEmployees();
      alert('Employee added successfully!');
    } catch (err) {
      console.error('Failed to add employee:', err);
      alert('Failed to add employee');
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEmployee) return;

    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: editingEmployee.name,
          passcode: editingEmployee.passcode,
          role: editingEmployee.role,
          is_active: editingEmployee.is_active
        })
        .eq('id', editingEmployee.id);

      if (error) {
        console.error('Error updating employee:', error);
        alert('Failed to update employee');
        return;
      }

      setEditingEmployee(null);
      loadEmployees();
      alert('Employee updated successfully!');
    } catch (err) {
      console.error('Failed to update employee:', err);
      alert('Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id);

      if (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
        return;
      }

      loadEmployees();
      alert('Employee deleted successfully!');
    } catch (err) {
      console.error('Failed to delete employee:', err);
      alert('Failed to delete employee');
    }
  };

  const toggleEmployeeStatus = async (employee: Employee) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: !employee.is_active })
        .eq('id', employee.id);

      if (error) {
        console.error('Error updating employee status:', error);
        alert('Failed to update employee status');
        return;
      }

      loadEmployees();
    } catch (err) {
      console.error('Failed to update employee status:', err);
      alert('Failed to update employee status');
    }
  };

  const activeEmployees = employees.filter(emp => emp.is_active).length;
  const inactiveEmployees = employees.filter(emp => !emp.is_active).length;

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
          <h1 className="text-2xl font-bold text-text-primary">Employee Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Employees</p>
                <p className="text-2xl font-bold text-text-primary">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Active</p>
                <p className="text-2xl font-bold text-text-primary">{activeEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary p-6 rounded-lg shadow border border-border-color">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Inactive</p>
                <p className="text-2xl font-bold text-text-primary">{inactiveEmployees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-bg-secondary rounded-lg shadow border border-border-color overflow-hidden">
          <div className="px-6 py-4 border-b border-border-color flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-primary">Employees</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-2 text-text-muted">Loading employees...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-color">
                <thead className="bg-bg-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-secondary divide-y divide-border-color">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-bg-tertiary">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {employee.employee_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        {new Date(employee.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => toggleEmployeeStatus(employee)}
                            className={`${employee.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {employee.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="text-red-600 hover:text-red-900"
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
          )}
        </div>

        {/* Add Employee Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Employee</h2>
                <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
              </div>
              
              <form onSubmit={handleAddEmployee} className="login-form">
                <div className="form-group">
                  <label htmlFor="employee_id">Employee ID</label>
                  <input
                    type="text"
                    id="employee_id"
                    value={newEmployee.employee_id}
                    onChange={(e) => setNewEmployee({...newEmployee, employee_id: e.target.value})}
                    placeholder="e.g., EMP001"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="passcode">Passcode</label>
                  <input
                    type="password"
                    id="passcode"
                    value={newEmployee.passcode}
                    onChange={(e) => setNewEmployee({...newEmployee, passcode: e.target.value})}
                    placeholder="Enter passcode"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    className="w-full p-3 border border-border-color rounded-lg bg-bg-secondary text-text-primary"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit">
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {editingEmployee && (
          <div className="modal-overlay" onClick={() => setEditingEmployee(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Employee</h2>
                <button className="modal-close" onClick={() => setEditingEmployee(null)}>×</button>
              </div>
              
              <form onSubmit={handleUpdateEmployee} className="login-form">
                <div className="form-group">
                  <label htmlFor="edit_employee_id">Employee ID</label>
                  <input
                    type="text"
                    id="edit_employee_id"
                    value={editingEmployee.employee_id}
                    disabled
                    className="bg-bg-tertiary text-text-muted"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit_name">Full Name</label>
                  <input
                    type="text"
                    id="edit_name"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit_passcode">Passcode</label>
                  <input
                    type="password"
                    id="edit_passcode"
                    value={editingEmployee.passcode}
                    onChange={(e) => setEditingEmployee({...editingEmployee, passcode: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit_role">Role</label>
                  <select
                    id="edit_role"
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                    className="w-full p-3 border border-border-color rounded-lg bg-bg-secondary text-text-primary"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingEmployee.is_active}
                      onChange={(e) => setEditingEmployee({...editingEmployee, is_active: e.target.checked})}
                    />
                    Active Employee
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setEditingEmployee(null)}>
                    Cancel
                  </button>
                  <button type="submit">
                    Update Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default EmployeeManagementPage;