import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // For development purposes, bypass all authentication and role checks
  // This allows direct access to all pages without passcode verification
  return <>{children}</>;
};

export default ProtectedRoute;