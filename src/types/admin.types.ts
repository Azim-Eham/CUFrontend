import type { User } from "./auth.types";

export interface Admin {
  _id: string;
  adminId: string;
  userId: User | string;
  name: { firstName: string; lastName: string };
  contactNo?: string;
  emergencyContactNo?: string;
  designation: string;
  profileImg?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
