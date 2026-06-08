import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { postApi } from "@/api/post.api";
import { studentApi } from "@/api/student.api";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { Post } from "@/types/post.types";
import type { PaginatedResponse } from "@/types/api.types";
import PageWrapper from "@/components/layout/PageWrapper";
import PostCard from "@/components/posts/PostCard";
import PostFilters from "@/components/posts/PostFilters";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Button from "@/components/ui/Button";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { page, limit, goToPage } = usePagination();

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const debouncedSearch = useDebounce(search);

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      studentApi.getById(user.id).then((res) => {
        setName(res.data.data.name);
      }).catch(() => {});
    }
  }, [user?.id]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postApi.getAll({
        searchTerm: debouncedSearch || undefined,
        type: typeFilter || undefined,
        page,
        limit,
      });
      const data: PaginatedResponse<Post> = res.data;
      setPosts(data.data.result);
      setTotalPage(data.data.meta.totalPage);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, typeFilter, page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    goToPage(1);
  }, [debouncedSearch, typeFilter, goToPage]);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {name || "Student"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse posts from the community
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <PostFilters
          searchTerm={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
        <Link to="/student/create-post">
          <Button>
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try adjusting your filters or create a new post."
        />
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDeleted={fetchPosts} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPage={totalPage}
            onPageChange={goToPage}
          />
        </>
      )}
    </PageWrapper>
  );
}
