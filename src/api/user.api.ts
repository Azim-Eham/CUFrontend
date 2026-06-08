import axiosInstance from "./axiosInstance";

export const userApi = {
  getAll: () =>
    axiosInstance.get("/users"),

  getById: (id: string) =>
    axiosInstance.get(`/users/${id}`),

  updateMeAccount: (data: { email?: string }) =>
    axiosInstance.patch("/users/me/account", data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    axiosInstance.patch("/users/me/change-password", data),

  updateById: (id: string, data: { role?: string; status?: string; isDeleted?: boolean; isVerified?: boolean }) =>
    axiosInstance.patch(`/users/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete(`/users/${id}`),
};
