import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { postApi } from "@/api/post.api";
import { alumniApi } from "@/api/alumni.api";
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

export default function AlumniDashboard() {
  const { user } = useAuthStore();
  const { page, limit, goToPage } = usePagination();

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const debouncedSearch = useDebounce(search);

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Tabs and Mentorship requests state
  const [activeTab, setActiveTab] = useState<"posts" | "requests">("posts");
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [stats, setStats] = useState({
    postsCount: 0,
    commentsCount: 12,
    mentorshipRequests: 0,
  });

  useEffect(() => {
    alumniApi.getMe().then((res) => {
      setName(res.data.data.name);
    }).catch(() => {});
  }, []);

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
      const pendingCount = res.data.data.result.filter((r: any) => r.status === "pending").length;
      setStats((prev) => ({ ...prev, mentorshipRequests: pendingCount }));
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
    if (user?.id) {
      postApi
        .getAll({ limit: 100 })
        .then((res) => {
          const userPosts = res.data.data.result.filter((p: any) => {
            const authorEmail = typeof p.author === "object" ? p.author.email : "";
            return authorEmail && user.email && authorEmail === user.email;
          });
          setStats((prev) => ({ ...prev, postsCount: userPosts.length }));
        })
        .catch(() => {});

      mentorshipApi.getRequests().then((res) => {
        const pendingCount = res.data.data.result.filter((r: any) => r.status === "pending").length;
        setStats((prev) => ({ ...prev, mentorshipRequests: pendingCount }));
      }).catch(() => {});
    }
  }, [user?.id, posts]);

  const handleUpdateStatus = async (requestId: string, status: "approved" | "rejected") => {
    try {
      await mentorshipApi.updateStatus(requestId, status);
      toast.success(`Mentorship request has been ${status}.`);
      fetchRequests();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || `Failed to update request status to ${status}.`;
      toast.error(errMsg);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    goToPage(1);
  }, [debouncedSearch, typeFilter, goToPage]);

  return (
    <PageWrapper>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight animate-fadeInUp">
            {getGreeting()}, {name || "Alumni"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "posts"
              ? "Manage your contributions and help guide students"
              : "Review and respond to mentorship requests from current students"}
          </p>
        </div>
        {activeTab === "posts" && (
          <Link to="/alumni/posts/create">
            <Button>
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-primary-500/5 border-primary-100 p-4" padding={false}>
          <div className="p-4">
            <p className="text-2xl font-bold text-primary-700">{stats.postsCount}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">My Posts</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-accent-500/5 border-amber-100 p-4" padding={false}>
          <div className="p-4">
            <p className="text-2xl font-bold text-amber-700">{stats.commentsCount}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Total Reactions</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-100 p-4" padding={false}>
          <div className="p-4">
            <p className="text-2xl font-bold text-green-700">{stats.mentorshipRequests}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Pending Requests</p>
          </div>
        </Card>
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
          My Posts
        </button>
        <button
          className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "requests"
              ? "border-primary-950 text-primary-950"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Mentorship Requests ({stats.mentorshipRequests})
        </button>
      </div>

      {activeTab === "posts" ? (
        <>
          <div className="mb-6 flex items-center justify-between">
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
        <div className="space-y-4 animate-fadeInUp">
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
              title="No requests received"
              description="Requests will show up here when students apply for your mentorship."
            />
          ) : (
            requests.map((req) => (
              <Card key={req._id} className="p-6 border-gray-200/80 hover:border-gray-300 transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {req.studentId?.name || "Student"}
                      </h3>
                      <Badge variant="primary">
                        {req.studentId?.studyInfo?.currentProgram || "Student"} - Year {req.studentId?.studyInfo?.currentYear || 1}
                      </Badge>
                      <Badge variant="default">
                        Session: {req.studentId?.session || "N/A"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Department of {req.studentId?.department || "N/A"}
                    </p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mt-3 text-sm text-gray-700 italic">
                      "{req.message}"
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 min-w-[160px] pt-2 md:pt-0">
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
                    
                    {req.status === "pending" ? (
                      <div className="flex gap-2 w-full md:justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 border-none px-3 gap-1"
                          onClick={() => handleUpdateStatus(req._id, "approved")}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 px-3 gap-1"
                          onClick={() => handleUpdateStatus(req._id, "rejected")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-400">
                        Response recorded
                      </span>
                    )}

                    <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
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

