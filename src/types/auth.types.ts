export interface User {
  _id: string;
  id: string;
  email: string;
  role: "student" | "teacher" | "alumni" | "admin";
  status: "active" | "blocked" | "pending";
  isDeleted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  id?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface SignupStudentRequest {
  email: string;
  password: string;
  student: {
    studentId: string;
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
    socialMedia?: { platform: string; link: string }[];
    skills?: string[];
    interests?: string[];
    achievements?: { title: string; description?: string; year: number }[];
    bio?: string;
    profileImage?: string;
    cvLink?: string;
    portfolioLink?: string;
  };
}

export interface SignupAlumniRequest {
  email: string;
  password: string;
  alumni: {
    studentId: string;
    name: string;
    gender: string;
    graduationYear: number;
    contactNumber: string;
    session: string;
    department: string;
    faculty: string;
    willingToMentor: boolean;
    location: { country: string; city: string };
    onlinePresence?: { platform: string; link: string }[];
    achievements?: { title: string; description?: string; year: number }[];
    portfolioLink?: string;
    bio?: string;
    alumniProfile: {
      alumniCategory: string;
      corporateInfo?: any[];
      researchInfo?: any[];
      academiaInfo?: any[];
      administrationInfo?: any[];
      businessInfo?: any[];
      otherInfo?: any[];
    };
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
