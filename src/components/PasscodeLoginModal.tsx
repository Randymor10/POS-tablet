import React, { useState } from 'react';
import { useEmployee } from '../contexts/EmployeeContext';

interface PasscodeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasscodeLoginModal({ isOpen, onClose }: PasscodeLoginModalProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useEmployee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employeeId.trim() || !passcode.trim()) {
      setError('Please enter both Employee ID and Passcode');
      return;
    }

    const result = await login(employeeId.trim(), passcode.trim());
    
    if (result.success) {
      setEmployeeId('');
      setPasscode('');
      setError('');
      onClose();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleClose = () => {
    setEmployeeId('');
    setPasscode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Employee Login</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your employee ID"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="passcode">Passcode</label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter your passcode"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button type="button" onClick={handleClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}