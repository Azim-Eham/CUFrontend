import type { User } from "./auth.types";

export interface Alumni {
  _id: string;
  studentId: string;
  userId: User | string;
  name: string;
  gender: string;
  graduationYear: number;
  contactNumber: string;
  session: string;
  department: string;
  faculty: string;
  willingToMentor: boolean;
  location: { country: string; city: string };
  onlinePresence: { platform: string; link: string }[];
  achievements: { title: string; description?: string; year: number }[];
  portfolioLink?: string;
  bio?: string;
  alumniProfile: {
    alumniCategory: string;
    corporateInfo: CorporateInfo[];
    researchInfo: ResearchInfo[];
    academiaInfo: AcademiaInfo[];
    administrationInfo: AdministrationInfo[];
    businessInfo: BusinessInfo[];
    otherInfo: OtherInfo[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CorporateInfo {
  company: string;
  designation: string;
  description?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
}

export interface ResearchInfo {
  institution: string;
  researchArea: string[];
  designation: string;
  supervisor?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface AcademiaInfo {
  institution: string;
  designation: string;
  department: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface AdministrationInfo {
  organization: string;
  designation: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface BusinessInfo {
  businessName: string;
  designation: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  location?: string;
  website?: string;
}

export interface OtherInfo {
  title: string;
  designation?: string;
  description: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  location?: string;
}

export interface UpdateAlumniRequest {
  name?: string;
  gender?: string;
  contactNumber?: string;
  willingToMentor?: boolean;
  location?: { country: string; city: string };
  onlinePresence?: { platform: string; link: string }[];
  achievements?: { title: string; description?: string; year: number }[];
  portfolioLink?: string;
  bio?: string;
  alumniProfile?: Partial<Alumni["alumniProfile"]>;
}
