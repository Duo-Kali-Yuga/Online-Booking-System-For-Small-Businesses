import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user role is not allowed, send them to their specific home
    const redirectPath = user.role === 'provider' ? '/provider' : '/app';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;