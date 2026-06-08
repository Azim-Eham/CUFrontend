import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectMap: Record<string, string> = {
      student: "/student",
      alumni: "/alumni",
      admin: "/admin",
    };
    return <Navigate to={redirectMap[user.role] || "/login"} replace />;
  }

  return <>{children}</>;
}
