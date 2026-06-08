import { useEffect, useState, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PostFilters from "@/components/posts/PostFilters";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { adminApi } from "@/api/admin.api";
import type { Post } from "@/types/post.types";
import type { PaginatedResponse } from "@/types/api.types";
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from "@/utils/constants";
import { timeAgo, truncate } from "@/utils/formatters";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AllPosts() {
  const { page, limit, goToPage } = usePagination(1, 10);
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPage: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllPosts({
        page,
        limit,
        searchTerm: debouncedSearch || undefined,
        type: typeFilter || undefined,
      });
      const data: PaginatedResponse<Post> = res.data;
      setPosts(data.data.result);
      setMeta({ total: data.data.meta.total, totalPage: data.data.meta.totalPage });
    } catch {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, typeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await adminApi.deletePost(postId);
      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Posts</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage all posts</p>
      </div>

      <div className="mb-4">
        <PostFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="space-y-3">
            {posts.map((post) => {
              const author =
                typeof post.author === "object" ? post.author : null;

              return (
                <Card key={post._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.title && (
                          <h3 className="text-sm font-semibold text-gray-900">
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
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_STYLES[post.status] || ""
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {author?.email || "Unknown"} &middot; {timeAgo(post.createdAt)}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {truncate(post.description, 150)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                      onClick={() => handleDelete(post._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
    </PageWrapper>
  );
}
