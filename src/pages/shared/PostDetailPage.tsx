import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi } from "@/api/post.api";
import { commentApi } from "@/api/comment.api";
import type { Comment } from "@/api/comment.api";
import type { Post } from "@/types/post.types";
import { useAuthStore } from "@/stores/authStore";
import PageWrapper from "@/components/layout/PageWrapper";
import ReactionBar from "@/components/posts/ReactionBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Button from "@/components/ui/Button";
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from "@/utils/constants";
import { timeAgo } from "@/utils/formatters";
import { ArrowLeft, Tag, Send, Trash2, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;
    postApi
      .getById(postId)
      .then((res) => setPost(res.data.data))
      .catch(() => toast.error("Failed to load post"))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Post link copied to clipboard!");
  };

  // Fetch comments
  useEffect(() => {
    if (!postId) return;
    setCommentsLoading(true);
    commentApi
      .getByPost(postId)
      .then((res) => {
        const data = res.data.data;
        setComments(Array.isArray(data) ? data : data.result || []);
      })
      .catch(() => {
        // Comments endpoint may not exist yet — fail silently
      })
      .finally(() => setCommentsLoading(false));
  }, [postId]);

  const handleReact = async (type: string) => {
    if (!postId) return;
    try {
      const res = await postApi.react(postId, type);
      // Refresh post to get updated reaction counts
      const updatedPost = await postApi.getById(postId);
      setPost(updatedPost.data.data);
    } catch {
      toast.error("Failed to react");
    }
  };

  const handleComment = async () => {
    if (!postId || !newComment.trim()) return;
    setSubmitting(true);
    try {
      await commentApi.create(postId, newComment.trim());
      setNewComment("");
      // Refresh comments
      const res = await commentApi.getByPost(postId);
      const data = res.data.data;
      setComments(Array.isArray(data) ? data : data.result || []);
      // Update comment count
      const updatedPost = await postApi.getById(postId);
      setPost(updatedPost.data.data);
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) return;
    try {
      await commentApi.delete(postId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return <PageWrapper><p className="text-center text-gray-500 py-12">Post not found</p></PageWrapper>;

  const author = typeof post.author === "object" ? post.author : null;
  const authorName = author?.email?.split("@")[0] || "User";

  return (
    <PageWrapper maxWidth="md">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 page-enter">
        {/* Author header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white shadow-sm">
            {authorName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500">{post.authorRole && <span className="capitalize">{post.authorRole}</span>} · {timeAgo(post.createdAt)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${POST_TYPE_COLORS[post.type] || ""}`}>
              {POST_TYPE_LABELS[post.type] || post.type}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 h-7 py-0.5 px-2"
              onClick={handleCopyLink}
            >
              <Share2 className="h-3.5 w-3.5 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Content */}
        {post.title && <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{post.title}</h1>}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>

        {/* Media */}
        {post.media.length > 0 && (
          <div className="mt-6 space-y-3">
            {post.media.map((m, i) => (
              <div key={i} className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                {m.mediaType === "image" && <img src={m.url} alt={m.caption || ""} className="w-full max-h-96 object-cover" />}
                {m.mediaType === "video" && (
                  <div className="bg-black flex items-center justify-center max-h-96">
                    <video src={m.url} controls className="w-full max-h-96" />
                  </div>
                )}
                {m.mediaType === "link" && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 transition-colors border-t border-gray-200 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 border border-primary-100 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">External Resource</p>
                      <p className="text-sm font-semibold text-primary-650 truncate mt-0.5 group-hover:text-primary-800 transition-colors">{m.url}</p>
                    </div>
                  </a>
                )}
                {m.caption && <p className="p-3 text-xs text-gray-500 border-t border-gray-100 bg-white">{m.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Reactions */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <ReactionBar
            reactionCounts={post.reactionCounts}
            onReact={handleReact}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 page-enter">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comments {post.commentCount > 0 && <span className="text-sm font-normal text-gray-400">({post.commentCount})</span>}
        </h2>

        {/* New comment form */}
        <div className="flex gap-3 mb-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400"
            />
            <Button size="sm" loading={submitting} onClick={handleComment} disabled={!newComment.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Comments list */}
        {commentsLoading ? (
          <div className="py-4 text-center text-sm text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const commentAuthor = typeof comment.author === "object" ? comment.author : null;
              const commentName = commentAuthor?.email?.split("@")[0] || "User";
              const isOwn = commentAuthor && user && ("email" in commentAuthor ? commentAuthor.email === user.email : false);
              return (
                <div key={comment._id} className="flex gap-3 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    {commentName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{commentName}</span>
                      <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                      {isOwn && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
