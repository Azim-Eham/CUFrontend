import axiosInstance from "./axiosInstance";
import type { QueryParams } from "@/types/api.types";

function buildParams(q: QueryParams) {
  const params: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params[k] = v;
  });
  return params;
}

export const adminApi = {
  invite: (email: string) =>
    axiosInstance.post("/admin/invite", { email }),

  register: (data: { token: string; password: string; admin: any }) =>
    axiosInstance.post("/admin/register", data),

  getAll: (params: QueryParams) =>
    axiosInstance.get("/admin", { params: buildParams(params) }),

  getById: (adminId: string) =>
    axiosInstance.get(`/admin/${adminId}`),

  updateMe: (data: { admin: any }) =>
    axiosInstance.patch("/admin/me", data),

  delete: (adminId: string) =>
    axiosInstance.delete(`/admin/${adminId}`),

  getAllPosts: (params: QueryParams) =>
    axiosInstance.get("/admin/posts/all", { params: buildParams(params) }),

  getPendingPosts: (params?: QueryParams) =>
    axiosInstance.get("/admin/posts/pending", { params: params ? buildParams(params) : {} }),

  approvePost: (postId: string) =>
    axiosInstance.patch(`/admin/posts/${postId}/approve`),

  rejectPost: (postId: string, reason: string) =>
    axiosInstance.patch(`/admin/posts/${postId}/reject`, { rejectionReason: reason }),

  deletePost: (postId: string) =>
    axiosInstance.delete(`/admin/posts/${postId}`),
};
