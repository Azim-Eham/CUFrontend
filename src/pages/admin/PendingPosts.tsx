import { useEffect, useState, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { adminApi } from "@/api/admin.api";
import type { Post } from "@/types/post.types";
import type { PaginatedResponse } from "@/types/api.types";
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from "@/utils/constants";
import { timeAgo, truncate } from "@/utils/formatters";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { Check, X, FileText } from "lucide-react";

export default function PendingPosts() {
  const { page, limit, goToPage } = usePagination(1, 10);
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPage: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [rejectModal, setRejectModal] = useState<{ open: boolean; postId: string }>({
    open: false,
    postId: "",
  });
  const [rejectReason, setRejectReason] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingPosts({ page, limit });
      const data: PaginatedResponse<Post> = res.data;
      setPosts(data.data.result);
      setMeta({ total: data.data.meta.total, totalPage: data.data.meta.totalPage });
    } catch {
      toast.error("Failed to fetch pending posts");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleApprove = async (postId: string) => {
    setActionLoading(postId);
    try {
      await adminApi.approvePost(postId);
      toast.success("Post approved");
      fetchPosts();
    } catch {
      toast.error("Failed to approve post");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setActionLoading(rejectModal.postId);
    try {
      await adminApi.rejectPost(rejectModal.postId, rejectReason);
      toast.success("Post rejected");
      setRejectModal({ open: false, postId: "" });
      setRejectReason("");
      fetchPosts();
    } catch {
      toast.error("Failed to reject post");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Posts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and moderate community posts
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No pending posts"
          description="All posts have been reviewed."
        />
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => {
              const author =
                typeof post.author === "object" ? post.author : null;
              const isProcessing = actionLoading === post._id;

              return (
                <Card key={post._id}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.title && (
                            <h3 className="text-base font-semibold text-gray-900">
                              {post.title}
                            </h3>
                          )}
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              POST_TYPE_COLORS[post.type] || ""
                            }`}
                          >
                            {POST_TYPE_LABELS[post.type] || post.type}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          by {author?.email || "Unknown"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo(post.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {truncate(post.description, 200)}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="primary"
                        size="sm"
                        loading={isProcessing}
                        onClick={() => handleApprove(post._id)}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={isProcessing}
                        onClick={() =>
                          setRejectModal({ open: true, postId: post._id })
                        }
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={goToPage}
          />
        </>
      )}

      <Modal
        isOpen={rejectModal.open}
        onClose={() => {
          setRejectModal({ open: false, postId: "" });
          setRejectReason("");
        }}
        title="Reject Post"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Provide a reason for rejection..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRejectModal({ open: false, postId: "" });
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={actionLoading === rejectModal.postId}
              onClick={handleReject}
            >
              Reject Post
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
