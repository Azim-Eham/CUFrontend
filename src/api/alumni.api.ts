import axiosInstance from "./axiosInstance";
import type { QueryParams } from "@/types/api.types";
import type { UpdateAlumniRequest } from "@/types/alumni.types";

function buildParams(q: QueryParams) {
  const params: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params[k] = v;
  });
  return params;
}

export const alumniApi = {
  getMentors: (params?: QueryParams) =>
    axiosInstance.get("/alumni/mentors", { params: params ? buildParams(params) : {} }),

  getMe: () =>
    axiosInstance.get("/alumni/me"),

  updateMe: (data: UpdateAlumniRequest) =>
    axiosInstance.patch("/alumni/me", data),

  updateAccount: (data: { email?: string }) =>
    axiosInstance.patch("/alumni/me/account", data),

  getAll: (params: QueryParams) =>
    axiosInstance.get("/alumni", { params: buildParams(params) }),

  getByStudentId: (studentId: string) =>
    axiosInstance.get(`/alumni/${studentId}`),

  updateByStudentId: (studentId: string, data: UpdateAlumniRequest) =>
    axiosInstance.patch(`/alumni/${studentId}`, data),
};
