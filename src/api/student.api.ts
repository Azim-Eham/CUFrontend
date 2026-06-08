import axiosInstance from "./axiosInstance";
import type { QueryParams } from "@/types/api.types";
import type { UpdateStudentRequest } from "@/types/student.types";

function buildParams(q: QueryParams) {
  const params: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params[k] = v;
  });
  return params;
}

export const studentApi = {
  getAll: (params: QueryParams) =>
    axiosInstance.get("/students", { params: buildParams(params) }),

  getById: (studentId: string) =>
    axiosInstance.get(`/students/${studentId}`),

  updateMe: (data: UpdateStudentRequest) =>
    axiosInstance.patch("/students/me", data),

  updateById: (studentId: string, data: Partial<UpdateStudentRequest>) =>
    axiosInstance.patch(`/students/${studentId}`, data),

  delete: (studentId: string) =>
    axiosInstance.delete(`/students/${studentId}`),
};
