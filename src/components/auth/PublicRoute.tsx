import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const redirectMap: Record<string, string> = {
      student: "/student",
      alumni: "/alumni",
      admin: "/admin",
    };
    return <Navigate to={redirectMap[user.role] || "/login"} replace />;
  }

  return <>{children}</>;
}
