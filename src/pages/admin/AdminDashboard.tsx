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
