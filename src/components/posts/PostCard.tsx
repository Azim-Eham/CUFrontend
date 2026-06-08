import { POST_TYPES, POST_TYPE_LABELS, POST_TYPE_COLORS, REACTION_ICONS } from "@/utils/constants";
import { timeAgo } from "@/utils/formatters";
import type { Post } from "@/types/post.types";
import type { User } from "@/types/auth.types";
import { Link } from "react-router-dom";
import { MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { postApi } from "@/api/post.api";
import { toast } from "sonner";
import Badge from "@/components/ui/Badge";

interface PostCardProps {
  post: Post;
  onDeleted?: () => void;
}

export default function PostCard({ post, onDeleted }: PostCardProps) {
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const author = typeof post.author === "object" ? post.author : null;
  const authorName = author?.email?.split("@")[0] || "User";

  const isOwn = author?.email && user?.email && author.email === user.email;

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await postApi.delete(post._id);
      toast.success("Post deleted");
      onDeleted?.();
    } catch {
      toast.error("Failed to delete post");
    }
    setMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {authorName[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{authorName}</p>
              <p className="text-xs text-gray-500">
                {post.authorRole && <span className="capitalize">{post.authorRole}</span>}
                {" · "}
                {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${POST_TYPE_COLORS[post.type] || ""}`}>
              {POST_TYPE_LABELS[post.type] || post.type}
            </span>
            {isOwn && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-40 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <Link
                        to={`/posts/${post._id}/edit`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <Link to={`/posts/${post._id}`} className="block mt-3">
          {post.title && (
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-700 transition-colors">
              {post.title}
            </h3>
          )}
          <p className="mt-1 text-sm text-gray-600 line-clamp-3">{post.description}</p>
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reactions & Comments */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            {Object.entries(post.reactionCounts).map(([type, count]) =>
              count > 0 ? (
                <span key={type} className="inline-flex items-center gap-1 text-xs text-gray-500">
                  {REACTION_ICONS[type]} {count}
                </span>
              ) : null
            )}
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentCount}
          </div>
        </div>
      </div>
    </div>
  );
}
