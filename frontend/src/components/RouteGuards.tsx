import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../state/AuthContext';

export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const RequireRole: React.FC<{
  roles: UserRole[];
  children: React.ReactElement;
}> = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};
