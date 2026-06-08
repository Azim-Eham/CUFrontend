import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, Suspense, lazy } from "react";
import { useAuthStore } from "@/stores/authStore";
import useKeepAlive from "@/hooks/useKeepAlive";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminSidebar from "@/components/layout/AdminSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// ─── Lazy-loaded page components (code splitting) ───
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const LoginPage = lazy(() => import("@/pages/public/LoginPage"));
const SignupPage = lazy(() => import("@/pages/public/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/public/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/public/ResetPasswordPage"));
const MentorsPage = lazy(() => import("@/pages/public/MentorsPage"));
const AdminRegisterPage = lazy(() => import("@/pages/public/AdminRegisterPage"));

const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const StudentProfile = lazy(() => import("@/pages/student/StudentProfile"));
const EditStudentProfile = lazy(() => import("@/pages/student/EditStudentProfile"));
const StudentSettings = lazy(() => import("@/pages/student/StudentSettings"));
const StudentCreatePost = lazy(() => import("@/pages/student/CreatePost"));

const AlumniDashboard = lazy(() => import("@/pages/alumni/AlumniDashboard"));
const AlumniProfile = lazy(() => import("@/pages/alumni/AlumniProfile"));
const EditAlumniProfile = lazy(() => import("@/pages/alumni/EditAlumniProfile"));
const AlumniSettings = lazy(() => import("@/pages/alumni/AlumniSettings"));
const AlumniCreatePost = lazy(() => import("@/pages/alumni/CreatePost"));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const PendingPosts = lazy(() => import("@/pages/admin/PendingPosts"));
const AllPosts = lazy(() => import("@/pages/admin/AllPosts"));
const ManageStudents = lazy(() => import("@/pages/admin/ManageStudents"));
const ManageAlumni = lazy(() => import("@/pages/admin/ManageAlumni"));
const ManageUsers = lazy(() => import("@/pages/admin/ManageUsers"));
const ManageAdmins = lazy(() => import("@/pages/admin/ManageAdmins"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const PostDetailPage = lazy(() => import("@/pages/shared/PostDetailPage"));
const NotFound = lazy(() => import("@/pages/shared/NotFound"));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <PageSuspense>
          <Outlet />
        </PageSuspense>
      </div>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <PageSuspense>
            <Outlet />
          </PageSuspense>
        </div>
      </div>
    </div>
  );
}

function App() {
  const initialize = useAuthStore((s) => s.initialize);
  useKeepAlive();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute><PublicLayout /></PublicRoute>}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
          </Route>

          {/* Student routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PublicLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/profile/edit" element={<EditStudentProfile />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/student/posts/create" element={<StudentCreatePost />} />
          </Route>

          {/* Alumni routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["alumni"]}>
                <PublicLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/alumni" element={<AlumniDashboard />} />
            <Route path="/alumni/profile" element={<AlumniProfile />} />
            <Route path="/alumni/profile/edit" element={<EditAlumniProfile />} />
            <Route path="/alumni/settings" element={<AlumniSettings />} />
            <Route path="/alumni/posts/create" element={<AlumniCreatePost />} />
          </Route>

          {/* Admin routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts/pending" element={<PendingPosts />} />
            <Route path="/admin/posts/all" element={<AllPosts />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/alumni" element={<ManageAlumni />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/admins" element={<ManageAdmins />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Shared routes (any authenticated role) */}
          <Route
            element={
              <ProtectedRoute>
                <PublicLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/posts/:postId" element={<PostDetailPage />} />
          </Route>

          <Route path="*" element={<PageSuspense><NotFound /></PageSuspense>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
