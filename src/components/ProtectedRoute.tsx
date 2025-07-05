import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Bypass all authentication checks - render children directly
  return <>{children}</>;
};

export default ProtectedRoute;