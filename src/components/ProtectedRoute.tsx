import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { employee, isLoggedIn } = useEmployee();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [isLoggedIn, employee, requiredRole, navigate]);

  // Don't render children if not logged in or doesn't have required role
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

  return <>{children}</>;
};

export default ProtectedRoute;