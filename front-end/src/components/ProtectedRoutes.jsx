import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingAnimation from "./layout/LoadingAnimation";


export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // 🔥 WAIT until auth loads
  if (loading) {
    return <LoadingAnimation/>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}