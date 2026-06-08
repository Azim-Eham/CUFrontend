import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { studentApi } from "@/api/student.api";
import { alumniApi } from "@/api/alumni.api";
import { adminApi } from "@/api/admin.api";
import { userApi } from "@/api/user.api";
import type { Post } from "@/types/post.types";
import { timeAgo } from "@/utils/formatters";
import { POST_TYPE_LABELS } from "@/utils/constants";
import {
  GraduationCap,
  Users,
  FileCheck,
  UserCog,
  ArrowRight,
  FileText,
} from "lucide-react";

interface Stats {
  totalStudents: number;
  totalAlumni: number;
  pendingPosts: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalAlumni: 0,
    pendingPosts: 0,
    totalUsers: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsRes, alumniRes, pendingRes, usersRes] = await Promise.all([
          studentApi.getAll({ limit: 1 }),
          alumniApi.getAll({ limit: 1 }),
          adminApi.getPendingPosts({ limit: 5 }),
          userApi.getAll(),
        ]);

        setStats({
          totalStudents: studentsRes.data.data.meta.total,
          totalAlumni: alumniRes.data.data.meta.total,
          pendingPosts: pendingRes.data.data.meta.total,
          totalUsers: Array.isArray(usersRes.data.data) ? usersRes.data.data.length : usersRes.data.data.meta?.total || 0,
        });

        setRecentPosts(pendingRes.data.data.result);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-100",
      link: "/admin/students",
    },
    {
      label: "Total Alumni",
      value: stats.totalAlumni,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-100",
      link: "/admin/alumni",
    },
    {
      label: "Pending Posts",
      value: stats.pendingPosts,
      icon: FileCheck,
      color: "text-orange-600",
      bg: "bg-orange-100",
      link: "/admin/posts/pending",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: UserCog,
      color: "text-purple-600",
      bg: "bg-purple-100",
      link: "/admin/users",
    },
  ];

  const quickLinks = [
    { label: "Review Pending Posts", to: "/admin/posts/pending", icon: FileCheck },
    { label: "Manage Students", to: "/admin/students", icon: GraduationCap },
    { label: "Manage Alumni", to: "/admin/alumni", icon: Users },
  ];

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <link.icon className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* SVG/CSS Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Registration Trend Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">User Registrations Trend</h3>
          <div className="relative h-48 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3355ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3355ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              <path
                d="M40 170 L40 150 L120 130 L200 100 L280 80 L360 50 L440 20 L440 170 Z"
                fill="url(#chartGrad)"
              />

              <path
                d="M40 150 L120 130 L200 100 L280 80 L360 50 L440 20"
                fill="none"
                stroke="#3355ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="40" cy="150" r="4" fill="#ffffff" stroke="#3355ff" strokeWidth="2" />
              <circle cx="120" cy="130" r="4" fill="#ffffff" stroke="#3355ff" strokeWidth="2" />
              <circle cx="200" cy="100" r="4" fill="#ffffff" stroke="#3355ff" strokeWidth="2" />
              <circle cx="280" cy="80" r="4" fill="#ffffff" stroke="#3355ff" strokeWidth="2" />
              <circle cx="360" cy="50" r="4" fill="#ffffff" stroke="#3355ff" strokeWidth="2" />
              <circle cx="440" cy="20" r="4" fill="#ffffff" stroke="#3355ff" strokeWidth="2" />

              <text x="40" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Jan</text>
              <text x="120" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Feb</text>
              <text x="200" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Mar</text>
              <text x="280" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Apr</text>
              <text x="360" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">May</text>
              <text x="440" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Jun</text>

              <text x="30" y="174" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
              <text x="30" y="124" fill="#94a3b8" fontSize="10" textAnchor="end">300</text>
              <text x="30" y="74" fill="#94a3b8" fontSize="10" textAnchor="end">600</text>
              <text x="30" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">900</text>
            </svg>
          </div>
        </Card>

        {/* Categories Breakdown */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Post Categories Breakdown</h3>
          <div className="space-y-3.5">
            {[
              { name: "Blog", count: 45, percentage: "85%", color: "bg-blue-500" },
              { name: "Opportunity", count: 28, percentage: "55%", color: "bg-green-500" },
              { name: "Course", count: 18, percentage: "35%", color: "bg-purple-500" },
              { name: "Seminar", count: 12, percentage: "25%", color: "bg-orange-500" },
              { name: "General", count: 32, percentage: "60%", color: "bg-gray-500" },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>{cat.name}</span>
                  <span>{cat.count} posts</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: cat.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Pending Posts */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Pending Posts</h2>
          <Link
            to="/admin/posts/pending"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No pending posts</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => {
              const author =
                typeof post.author === "object" ? post.author : null;
              return (
                <Card key={post._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {post.title && (
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {post.title}
                          </h3>
                        )}
                        <Badge variant="warning">
                          {POST_TYPE_LABELS[post.type] || post.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {author?.email || "Unknown author"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
