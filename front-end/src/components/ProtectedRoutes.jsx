import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlobalLoader from "./layout/GlobalLoader";


export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // 🔥 WAIT until auth loads
  if (loading) {
    return <GlobalLoader/>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}