export const POST_TYPES = ["blog", "opportunity", "course", "seminar", "general"] as const;
export const POST_STATUSES = ["pending", "approved", "rejected"] as const;
export const REACTION_TYPES = ["like", "love", "insightful", "support"] as const;
export const MEDIA_TYPES = ["image", "video", "link"] as const;
export const Genders = ["male", "female", "other"] as const;
export const PROGRAMS = ["Bachelor", "Masters", "PhD"] as const;
export const SOCIAL_PLATFORMS = ["facebook", "linkedin", "github", "twitter", "website"] as const;
export const ALUMNI_CATEGORIES = ["corporate", "research", "academia", "administration", "business", "other"] as const;
export const ROLES = ["student", "alumni", "admin"] as const;

export const POST_TYPE_LABELS: Record<string, string> = {
  blog: "Blog",
  opportunity: "Opportunity",
  course: "Course",
  seminar: "Seminar",
  general: "General",
};

export const POST_TYPE_COLORS: Record<string, string> = {
  blog: "bg-blue-100 text-blue-700",
  opportunity: "bg-green-100 text-green-700",
  course: "bg-purple-100 text-purple-700",
  seminar: "bg-orange-100 text-orange-700",
  general: "bg-gray-100 text-gray-700",
};

export const REACTION_ICONS: Record<string, string> = {
  like: "👍",
  love: "❤️",
  insightful: "💡",
  support: "🤝",
};

export const ROLE_COLORS: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  alumni: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};
