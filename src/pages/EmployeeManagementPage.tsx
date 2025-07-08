import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Plus, Edit, Trash2 } from 'lucide-react';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../lib/supabase';
import EmployeeFormModal from '../components/EmployeeFormModal';
import type { Employee } from '../lib/supabase';

interface EditingState {
  type: 'header' | 'cell' | null;
  headerIndex?: number;
  employeeId?: string;
  field?: string;
}

const EmployeeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editing, setEditing] = useState<EditingState>({ type: null });
  const [editValue, setEditValue] = useState('');

  // Editable headers
  const [headers, setHeaders] = useState([
    'Employee ID',
    'Name', 
    'Role',
    'Status',
    'Last Updated',
    'Actions'
  ]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    switch (filter) {
      case 'active':
        return employee.is_active;
      case 'inactive':
        return !employee.is_active;
      default:
        return true;
    }
  });

  const activeEmployees = employees.filter(emp => emp.is_active).length;
  const inactiveEmployees = employees.filter(emp => !emp.is_active).length;
  const totalEmployees = employees.length;

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete employee ${employee.name}?`)) {
      const success = await deleteEmployee(employee.id);
      if (success) {
        await loadEmployees();
      } else {
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      let success = false;
      
      if (editingEmployee) {
        // Update existing employee
        const result = await updateEmployee(editingEmployee.id, employeeData);
        success = !!result;
      } else {
        // Add new employee
        const result = await addEmployee(employeeData);
        success = !!result;
      }

      if (success) {
        await loadEmployees();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      return false;
    }
  };

  const handleHeaderDoubleClick = (index: number) => {
    // Don't allow editing of Actions column
    if (index === headers.length - 1) return;
    
    setEditing({ type: 'header', headerIndex: index });
    setEditValue(headers[index]);
  };

  const handleCellDoubleClick = (employeeId: string, field: string) => {
    // Only allow editing of employee_id, name, role, and is_active
    if (!['employee_id', 'name', 'role', 'is_active'].includes(field)) return;
    
    setEditing({ type: 'cell', employeeId, field });
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      if (field === 'is_active') {
        setEditValue(employee.is_active ? 'true' : 'false');
      } else {
        setEditValue(String(employee[field as keyof Employee]));
      }
    }
  };

  const handleEditSave = async () => {
    if (editing.type === 'header' && editing.headerIndex !== undefined) {
      const newHeaders = [...headers];
      newHeaders[editing.headerIndex] = editValue;
      setHeaders(newHeaders);
    } else if (editing.type === 'cell' && editing.employeeId && editing.field) {
      const employee = employees.find(e => e.id === editing.employeeId);
      if (employee) {
        const updates: Partial<Employee> = {};
        
        if (editing.field === 'is_active') {
          updates.is_active = editValue === 'true';
        } else {
          (updates as any)[editing.field] = editValue;
        }
        
        const result = await updateEmployee(employee.id, updates);
        if (result) {
          await loadEmployees();
        }
      }
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

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return `${month}/${day} ${formattedTime}`;
  };

  const renderEditableCell = (employee: Employee, field: string, value: any) => {
    const isEditing = editing.type === 'cell' && editing.employeeId === employee.id && editing.field === field;
    
    // Only allow editing of specific fields
    if (!['employee_id', 'name', 'role', 'is_active'].includes(field)) {
      if (field === 'updated_at' || field === 'created_at') {
        return <span>{formatDateTime(value)}</span>;
      }
      return <span>{value}</span>;
    }
    
    if (isEditing) {
      if (field === 'role') {
        return (
          <select
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
          >
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        );
      } else if (field === 'is_active') {
        return (
          <select
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
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        );
      } else {
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
    }

    return (
      <span
        onDoubleClick={() => handleCellDoubleClick(employee.id, field)}
        className="cursor-pointer hover:bg-opacity-50 px-2 py-1 rounded transition-colors"
        style={{ backgroundColor: 'transparent' }}
        title="Double-click to edit"
      >
        {field === 'is_active' ? (employee.is_active ? 'Active' : 'Inactive') : value}
      </span>
    );
  };

  const renderEditableHeader = (header: string, index: number) => {
    const isEditing = editing.type === 'header' && editing.headerIndex === index;
    
    // Don't allow editing of Actions column
    if (index === headers.length - 1) {
      return <span>{header}</span>;
    }
    
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
            Employee Management
          </h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All Employees' },
            { key: 'active', label: 'Active' },
            { key: 'inactive', label: 'Inactive' },
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
            {/* Total Employees Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--info-accent-light)' }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--info-accent)' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Total Employees
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalEmployees}
              </p>
            </div>

            {/* Active Employees Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <UserCheck className="w-6 h-6" style={{ color: '#22c55e' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Active
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {activeEmployees}
              </p>
            </div>

            {/* Inactive Employees Column */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <UserX className="w-6 h-6" style={{ color: '#ef4444' }} />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Inactive
              </h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {inactiveEmployees}
              </p>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="rounded-lg shadow overflow-hidden" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Employees
            </h2>
            <button 
              onClick={handleAddEmployee}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none'
              }}
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--accent-primary)' }}></div>
              <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No employees found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <tr>
                    {headers.map((header, index) => (
                      <th 
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {renderEditableHeader(header, index)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {filteredEmployees.map((employee, index) => (
                    <tr 
                      key={employee.id} 
                      className="hover:opacity-80 transition-opacity"
                      style={{ 
                        borderBottom: index < filteredEmployees.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {renderEditableCell(employee, 'employee_id', employee.employee_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                        {renderEditableCell(employee, 'name', employee.name)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                        {renderEditableCell(employee, 'role', employee.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.is_active ? 'text-green-800' : 'text-red-800'
                        }`} style={{
                          backgroundColor: employee.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                        }}>
                          {renderEditableCell(employee, 'is_active', employee.is_active)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-muted)' }}>
                        {formatDateTime(employee.updated_at || employee.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="p-1 rounded hover:bg-opacity-20 transition-colors"
                            style={{ color: 'var(--info-accent)' }}
                            title="Edit employee"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="p-1 rounded hover:bg-opacity-20 transition-colors"
                            style={{ color: '#ef4444' }}
                            title="Delete employee"
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

        <div className="mt-4 p-4 rounded-lg" style={{ 
          backgroundColor: 'var(--info-accent-light)', 
          border: '1px solid var(--info-accent)' 
        }}>
          <p className="text-sm" style={{ color: 'var(--info-accent)' }}>
            <strong>Employee Management:</strong> Double-click any header or editable cell to modify. 
            You can edit Employee ID, Name, Role, and Status directly in the table. Use the action buttons to edit full details or delete employees.
          </p>
        </div>
      </div>

      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default EmployeeManagementPage;