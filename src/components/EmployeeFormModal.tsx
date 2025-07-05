import React, { useState, useEffect } from 'react';
import { User, Lock, UserCheck, AlertCircle } from 'lucide-react';
import type { Employee } from '../lib/supabase';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSubmit: (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    passcode: '',
    role: 'cashier',
    is_active: true,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!employee;

  // Pre-fill form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.employee_id,
        name: employee.name,
        passcode: employee.passcode,
        role: employee.role,
        is_active: employee.is_active,
      });
    } else {
      setFormData({
        employee_id: '',
        name: '',
        passcode: '',
        role: 'cashier',
        is_active: true,
      });
    }
    setError('');
  }, [employee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.employee_id.trim()) {
      setError('Employee ID is required');
      return;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.passcode.trim()) {
      setError('Passcode is required');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await onSubmit(formData);
      
      if (success) {
        onClose();
      } else {
        setError('Failed to save employee. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Employee form submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employee_id: '',
      name: '',
      passcode: '',
      role: 'cashier',
      is_active: true,
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="employee_id">Employee ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="employee_id"
                value={formData.employee_id}
                onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                placeholder="Enter employee ID"
                disabled={isLoading}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                disabled={isLoading}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="passcode">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="passcode"
                value={formData.passcode}
                onChange={(e) => setFormData({...formData, passcode: e.target.value})}
                placeholder="Enter passcode"
                disabled={isLoading}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}
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
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                disabled={isLoading}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Active Employee
              </span>
            </label>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={handleClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update Employee' : 'Add Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;