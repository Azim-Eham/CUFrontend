import type { User } from "./auth.types";

export interface PostMedia {
  mediaType: "image" | "video" | "link";
  url: string;
  caption?: string;
}

export interface Reaction {
  userId: string;
  reactionType: "like" | "love" | "insightful" | "support";
}

export interface Post {
  _id: string;
  author: User | string;
  authorRole: "student" | "alumni";
  type: "blog" | "opportunity" | "course" | "seminar" | "general";
  title?: string;
  description: string;
  media: PostMedia[];
  tags: string[];
  reactions: Reaction[];
  reactionCounts: { like: number; love: number; insightful: number; support: number };
  commentCount: number;
  status: "pending" | "approved" | "rejected";
  approvedBy?: User | string;
  approvedAt?: string;
  rejectionReason?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  type: "blog" | "opportunity" | "course" | "seminar" | "general";
  title?: string;
  description: string;
  media?: PostMedia[];
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  media?: PostMedia[];
  tags?: string[];
  type?: string;
}
