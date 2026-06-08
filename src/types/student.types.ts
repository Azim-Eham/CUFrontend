import type { User } from "./auth.types";

export interface Student {
  _id: string;
  studentId: string;
  userId: User | string;
  name: string;
  session: string;
  department: string;
  faculty: string;
  studyInfo: {
    currentProgram: "Bachelor" | "Masters" | "PhD";
    currentYear: number;
    semester?: number;
  };
  contactNumber?: string;
  gender?: string;
  socialMedia: { platform: string; link: string }[];
  skills: string[];
  interests: string[];
  achievements: { title: string; description?: string; year: number }[];
  bio?: string;
  profileImage?: string;
  cvLink?: string;
  portfolioLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentRequest {
  name?: string;
  contactNumber?: string;
  gender?: string;
  socialMedia?: { platform: string; link: string }[];
  skills?: string[];
  interests?: string[];
  achievements?: { title: string; description?: string; year: number }[];
  bio?: string;
  profileImage?: string;
  cvLink?: string;
  portfolioLink?: string;
}
