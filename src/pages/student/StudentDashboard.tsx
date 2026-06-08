import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, XCircle, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { postApi } from "@/api/post.api";
import { studentApi } from "@/api/student.api";
import { mentorshipApi } from "@/api/mentorship.api";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { Post } from "@/types/post.types";
import type { PaginatedResponse } from "@/types/api.types";
import type { MentorshipRequest } from "@/types/mentorship.types";
import PageWrapper from "@/components/layout/PageWrapper";
import PostCard from "@/components/posts/PostCard";
import PostFilters from "@/components/posts/PostFilters";
import Pagination from "@/components/shared/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/shared/EmptyState";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { page, limit, goToPage } = usePagination();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const debouncedSearch = useDebounce(search);

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Tabs and Mentorship Requests State
  const [activeTab, setActiveTab] = useState<"posts" | "requests">("posts");
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

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

  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await mentorshipApi.getRequests();
      setRequests(res.data.data.result);
    } catch {
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab, fetchRequests]);

  useEffect(() => {
    goToPage(1);
  }, [debouncedSearch, typeFilter, goToPage]);

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this mentorship request?")) return;
    try {
      await mentorshipApi.cancelRequest(requestId);
      toast.success("Mentorship request canceled successfully.");
      fetchRequests();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to cancel request.";
      toast.error(errMsg);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight animate-fadeInUp">
            {getGreeting()}, {name || "Student"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "posts" 
              ? "Browse posts and updates from the community" 
              : "Track the status of your mentorship applications"}
          </p>
        </div>
        {activeTab === "posts" && (
          <Link to="/student/posts/create">
            <Button>
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "posts"
              ? "border-primary-950 text-primary-950"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Home Feed
        </button>
        <button
          className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "requests"
              ? "border-primary-950 text-primary-950"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          My Mentorship Requests
        </button>
      </div>

      {activeTab === "posts" ? (
        <>
          <div className="mb-6">
            <PostFilters
              searchTerm={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/6" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
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
        </>
      ) : (
        /* Mentorship Requests Tab */
        <div className="space-y-4">
          {requestsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-3">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <EmptyState
              title="No requests sent"
              description="Browse our mentors list and send your first request."
            />
          ) : (
            requests.map((req) => (
              <Card key={req._id} className="p-6 border-gray-200/80 hover:border-gray-300 transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {req.mentorId?.name || "Alumni"}
                      </h3>
                      <Badge variant="primary" className="capitalize">
                        {req.mentorId?.alumniProfile?.alumniCategory || "Alumni"}
                      </Badge>
                      <Badge variant="default">
                        Class of {req.mentorId?.graduationYear || "N/A"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {req.mentorId?.department} Department
                    </p>
                    <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-4 mt-3 text-sm text-gray-700 italic">
                      "{req.message}"
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 min-w-[140px] pt-2 md:pt-0">
                    <Badge
                      variant={
                        req.status === "approved"
                          ? "success"
                          : req.status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                    >
                      {req.status}
                    </Badge>
                    {req.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 gap-1.5"
                        onClick={() => handleCancelRequest(req._id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    )}
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </PageWrapper>
  );
}
