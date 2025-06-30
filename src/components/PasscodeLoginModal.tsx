import React, { useState, useRef, useEffect } from 'react';
import { Lock, AlertCircle, User } from 'lucide-react';
import { useEmployee } from '../contexts/EmployeeContext';
import { supabase } from '../lib/supabase';
import type { Employee } from '../lib/supabase';

interface PasscodeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasscodeLoginModal: React.FC<PasscodeLoginModalProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { login } = useEmployee();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError('');
      // Focus first input after modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handlePasscodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newPasscode = passcode.split('');
    newPasscode[index] = value;
    
    // Fill array to length 4
    while (newPasscode.length < 4) {
      newPasscode.push('');
    }
    
    const updatedPasscode = newPasscode.join('');
    setPasscode(updatedPasscode);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when 4 digits are entered
    if (updatedPasscode.length === 4 && !updatedPasscode.includes('')) {
      handleLogin(updatedPasscode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !passcode[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleLogin(passcode);
    }
  };

  const handleLogin = async (code: string) => {
    if (code.length !== 4) {
      setError('Please enter a 4-digit passcode');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Query the employees table for matching passcode
      const { data, error: queryError } = await supabase
        .from('employees')
        .select('*')
        .eq('passcode', code)
        .eq('is_active', true)
        .single();

      if (queryError || !data) {
        setError('Invalid passcode. Please try again.');
        setPasscode('');
        // Clear inputs and focus first one
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
        return;
      }

      // Login successful
      login(data as Employee);
      onClose();
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
      setPasscode('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="passcode-modal-overlay">
      <div className="passcode-modal">
        <div className="passcode-modal-header">
          <div className="passcode-modal-icon">
            <User className="w-8 h-8" />
          </div>
          <h2>Employee Login</h2>
          <p>Enter your 4-digit passcode</p>
        </div>

        <div className="passcode-modal-content">
          <div className="passcode-inputs">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={passcode[index] || ''}
                onChange={(e) => handlePasscodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="passcode-input"
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="passcode-error">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="passcode-actions">
            <button
              onClick={() => handleLogin(passcode)}
              disabled={isLoading || passcode.length !== 4}
              className="passcode-login-button"
            >
              {isLoading ? (
                <div className="passcode-spinner" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </div>

          <div className="passcode-help">
            <p>Contact your manager if you've forgotten your passcode</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasscodeLoginModal;