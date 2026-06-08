import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postApi } from "@/api/post.api";
import type { Post } from "@/types/post.types";
import PageWrapper from "@/components/layout/PageWrapper";
import ReactionBar from "@/components/posts/ReactionBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from "@/utils/constants";
import { timeAgo } from "@/utils/formatters";
import { ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    postApi
      .getById(postId)
      .then((res) => setPost(res.data.data))
      .catch(() => toast.error("Failed to load post"))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <LoadingSpinner />;
  if (!post) return <PageWrapper><p className="text-center text-gray-500 py-12">Post not found</p></PageWrapper>;

  const author = typeof post.author === "object" ? post.author : null;
  const authorName = author?.email?.split("@")[0] || "User";

  return (
    <PageWrapper maxWidth="md">
      <Link to={-1} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {authorName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500">{post.authorRole && <span className="capitalize">{post.authorRole}</span>} · {timeAgo(post.createdAt)}</p>
          </div>
          <span className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${POST_TYPE_COLORS[post.type]}`}>
            {POST_TYPE_LABELS[post.type]}
          </span>
        </div>

        {post.title && <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>

        {post.media.length > 0 && (
          <div className="mt-6 space-y-3">
            {post.media.map((m, i) => (
              <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
                {m.mediaType === "image" && <img src={m.url} alt={m.caption || ""} className="w-full max-h-96 object-cover" />}
                {m.mediaType === "video" && <video src={m.url} controls className="w-full max-h-96" />}
                {m.mediaType === "link" && (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="block p-3 text-sm text-primary-600 hover:underline">
                    {m.url}
                  </a>
                )}
                {m.caption && <p className="p-3 text-xs text-gray-500">{m.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4">
          <ReactionBar
            reactionCounts={post.reactionCounts}
            onReact={(type) => toast.info("Reactions coming soon")}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
