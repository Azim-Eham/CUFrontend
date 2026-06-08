import axiosInstance from "./axiosInstance";

export interface Comment {
  _id: string;
  postId: string;
  author: { _id: string; email: string; role: string } | string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const commentApi = {
  getByPost: (postId: string) =>
    axiosInstance.get(`/posts/${postId}/comments`),

  create: (postId: string, content: string) =>
    axiosInstance.post(`/posts/${postId}/comments`, { content }),

  delete: (postId: string, commentId: string) =>
    axiosInstance.delete(`/posts/${postId}/comments/${commentId}`),
};
