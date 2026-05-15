import { useContext } from 'react';
import { Navigate } from 'react-router';

import { AuthContext } from '../../contexts/AuthContext/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to='/' />;
  }

  return children;
}