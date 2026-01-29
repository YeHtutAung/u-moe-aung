import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../api';

export default function ProtectedRoute({ children, requiredRole }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
