import axiosInstance from "./axiosInstance";
import type { QueryParams } from "@/types/api.types";

function buildParams(q: QueryParams) {
  const params: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params[k] = v;
  });
  return params;
}

export const mentorshipApi = {
  createRequest: (data: { mentorId: string; message: string }) =>
    axiosInstance.post("/mentorship", data),

  getRequests: (params?: QueryParams) =>
    axiosInstance.get("/mentorship", { params: params ? buildParams(params) : {} }),

  updateStatus: (requestId: string, status: "approved" | "rejected") =>
    axiosInstance.patch(`/mentorship/${requestId}`, { status }),

  cancelRequest: (requestId: string) =>
    axiosInstance.delete(`/mentorship/${requestId}`),
};
