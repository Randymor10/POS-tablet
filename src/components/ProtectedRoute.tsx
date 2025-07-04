import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';
import { verifyEmployeePasscode } from '../lib/supabase';
import PasscodeVerificationModal from './PasscodeVerificationModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { employee, isLoggedIn } = useEmployee();
  const navigate = useNavigate();
  const [isContentUnlocked, setIsContentUnlocked] = useState(false);
  const [isPasscodeVerificationModalOpen, setIsPasscodeVerificationModalOpen] = useState(false);
  const [passcodeVerificationContext, setPasscodeVerificationContext] = useState({
    title: '',
    message: ''
  });

  useEffect(() => {
    // If not logged in, redirect to home
    if (!isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }

    // Check role-based access
    if (requiredRole && employee) {
      const hasRequiredRole = employee.role === requiredRole || 
                             employee.role === 'admin' || 
                             (requiredRole === 'manager' && ['manager', 'admin'].includes(employee.role));
      
      if (!hasRequiredRole) {
        navigate('/', { replace: true });
        return;
      }
    }

    // If user is logged in and has correct role, but content is not unlocked, show passcode modal
    if (isLoggedIn && employee && !isContentUnlocked) {
      // Determine the context based on required role
      let title: string;
      let message: string;

      switch (requiredRole) {
        case 'admin':
          title = 'Admin Access Required';
          message = 'Please enter your passcode to access admin features';
          break;
        case 'manager':
          title = 'Manager Access Required';
          message = 'Please enter your passcode to access manager features';
          break;
        default:
          title = 'Access Verification Required';
          message = 'Please enter your passcode to access this page';
      }

      setPasscodeVerificationContext({ title, message });
      setIsPasscodeVerificationModalOpen(true);
    }
  }, [isLoggedIn, employee, requiredRole, navigate, isContentUnlocked]);

  const handlePasscodeVerified = async (passcode: string): Promise<boolean> => {
    // Validate passcode input
    if (!passcode || !passcode.trim()) {
      return false;
    }

    if (!employee) {
      return false;
    }

    // Check if this action requires a specific role
    if (requiredRole) {
      const hasRequiredRole = employee.role === requiredRole || 
                             employee.role === 'admin' || 
                             (requiredRole === 'manager' && ['manager', 'admin'].includes(employee.role));
      
      if (!hasRequiredRole) {
        return false;
      }
    }

    try {
      const isValid = await verifyEmployeePasscode(employee.employee_id, passcode.trim());
      
      if (isValid) {
        setIsContentUnlocked(true);
        setIsPasscodeVerificationModalOpen(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Passcode verification error:', error);
      return false;
    }
  };

  const handlePasscodeModalClose = () => {
    // If user closes modal without verifying, redirect back to home
    setIsPasscodeVerificationModalOpen(false);
    navigate('/', { replace: true });
  };

  // Don't render anything if not logged in or doesn't have required role
  if (!isLoggedIn) {
    return null;
  }

  if (requiredRole && employee) {
    const hasRequiredRole = employee.role === requiredRole || 
                           employee.role === 'admin' || 
                           (requiredRole === 'manager' && ['manager', 'admin'].includes(employee.role));
    
    if (!hasRequiredRole) {
      return null;
    }
  }

  return (
    <>
      {/* Show passcode modal if content is not unlocked */}
      {!isContentUnlocked && (
        <PasscodeVerificationModal
          isOpen={isPasscodeVerificationModalOpen}
          onClose={handlePasscodeModalClose}
          onVerify={handlePasscodeVerified}
          title={passcodeVerificationContext.title}
          message={passcodeVerificationContext.message}
        />
      )}
      
      {/* Only render children if content is unlocked */}
      {isContentUnlocked && children}
    </>
  );
};

export default ProtectedRoute;