import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { employee, isLoggedIn } = useEmployee();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (requiredRole && employee) {
    const hasRequiredRole = employee.role === requiredRole || 
                           employee.role === 'admin' || 
                           (requiredRole === 'manager' && ['manager', 'admin'].includes(employee.role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;