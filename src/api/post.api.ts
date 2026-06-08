import axiosInstance from "./axiosInstance";
import type { QueryParams } from "@/types/api.types";
import type { CreatePostRequest, UpdatePostRequest } from "@/types/post.types";

function buildParams(q: QueryParams) {
  const params: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params[k] = v;
  });
  return params;
}

export const postApi = {
  getAll: (params: QueryParams) =>
    axiosInstance.get("/posts", { params: buildParams(params) }),

  getById: (postId: string) =>
    axiosInstance.get(`/posts/${postId}`),

  create: (data: CreatePostRequest) =>
    axiosInstance.post("/posts", data),

  update: (postId: string, data: UpdatePostRequest) =>
    axiosInstance.patch(`/posts/${postId}`, data),

  delete: (postId: string) =>
    axiosInstance.delete(`/posts/${postId}`),

  react: (postId: string, reactionType: string) =>
    axiosInstance.post(`/posts/${postId}/react`, { reactionType }),
};
