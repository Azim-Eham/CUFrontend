import type { Student } from "./student.types";
import type { Alumni } from "./alumni.types";

export interface MentorshipRequest {
  _id: string;
  studentId: Student;
  mentorId: Alumni;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}
