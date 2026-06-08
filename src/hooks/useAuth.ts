import { useAuthStore } from "@/stores/authStore";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";
import type { LoginRequest, SignupStudentRequest, SignupAlumniRequest } from "@/types/auth.types";

export function useAuth() {
  const { user, isAuthenticated, setAccessToken, logout } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data);
    setAccessToken(res.data.data.accessToken);
    toast.success("Logged in successfully");
    const role = useAuthStore.getState().user?.role;
    if (role === "admin") navigate("/admin");
    else if (role === "alumni") navigate("/alumni");
    else navigate("/student");
  }, [setAccessToken, navigate]);

  const signupStudent = useCallback(async (data: SignupStudentRequest) => {
    await authApi.signupStudent(data);
    toast.success("Account created! Please log in.");
    navigate("/login");
  }, [navigate]);

  const signupAlumni = useCallback(async (data: SignupAlumniRequest) => {
    await authApi.signupAlumni(data);
    toast.success("Account created! Please log in.");
    navigate("/login");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  }, [logout, navigate]);

  return { user, isAuthenticated, login, signupStudent, signupAlumni, logout: handleLogout };
}
