import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface PasscodeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (passcode: string) => Promise<boolean>;
  title?: string;
  message?: string;
}

const PasscodeVerificationModal: React.FC<PasscodeVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  title = "Passcode Required",
  message = "Please enter your passcode to complete this action"
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passcode.trim()) {
      setError('Please enter your passcode');
      return;
    }

    setIsLoading(true);
    
    try {
      const isValid = await onVerify(passcode.trim());
      
      if (isValid) {
        setPasscode('');
        setError('');
        onClose();
      } else {
        setError('Invalid passcode. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error('Passcode verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPasscode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <p className="text-gray-600 mb-4">{message}</p>
          
          <div className="form-group">
            <label htmlFor="passcode">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter your passcode"
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
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasscodeVerificationModal;