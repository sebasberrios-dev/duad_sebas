import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../store/AuthContext.jsx';

export function ProtectedRoute({ requireAdmin = false }) {
  const { isLogged, isAdmin, isLoggingOut } = useAuth();

  if (!isLogged) {
    return (
      <Navigate
        to={isLoggingOut ? '/' : '/no-access/unauthenticated'}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin)
    return <Navigate to="/no-access/unauthorized" />;

  return <Outlet />;
}
