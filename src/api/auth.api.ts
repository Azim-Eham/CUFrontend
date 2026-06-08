import axiosInstance from "./axiosInstance";
import type { LoginRequest, SignupStudentRequest, SignupAlumniRequest, ForgotPasswordRequest, ResetPasswordRequest } from "@/types/auth.types";

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post("/auth/login", data),

  signupStudent: (data: SignupStudentRequest) =>
    axiosInstance.post("/auth/signup/student", data),

  signupAlumni: (data: SignupAlumniRequest) =>
    axiosInstance.post("/auth/signup/alumni", data),

  refreshToken: () =>
    axiosInstance.post("/auth/refresh-token"),

  forgotPassword: (data: ForgotPasswordRequest) =>
    axiosInstance.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    axiosInstance.post("/auth/reset-password", data),
};
