import React, { useState } from 'react';
import { User, AlertCircle } from 'lucide-react';
import { useEmployee } from '../contexts/EmployeeContext';

interface EmployeeIdPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeIdSubmitted: () => void;
}

const EmployeeIdPromptModal: React.FC<EmployeeIdPromptModalProps> = ({
  isOpen,
  onClose,
  onEmployeeIdSubmitted,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useEmployee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employeeId.trim()) {
      setError('Please enter your Employee ID');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(employeeId.trim());
      
      if (result.success) {
        setEmployeeId('');
        setError('');
        onEmployeeIdSubmitted();
      } else {
        setError(result.error || 'Employee not found');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Employee ID login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmployeeId('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Employee Identification</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <p className="text-gray-600 mb-4">Please enter your Employee ID to continue</p>
          
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                disabled={isLoading}
                className="pl-10"
                autoFocus
              />
            </div>
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
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeIdPromptModal;