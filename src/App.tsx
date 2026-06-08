import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import useKeepAlive from "@/hooks/useKeepAlive";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminSidebar from "@/components/layout/AdminSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/public/LoginPage";
import SignupPage from "@/pages/public/SignupPage";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/public/ResetPasswordPage";
import MentorsPage from "@/pages/public/MentorsPage";
import AdminRegisterPage from "@/pages/public/AdminRegisterPage";

import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentProfile from "@/pages/student/StudentProfile";
import EditStudentProfile from "@/pages/student/EditStudentProfile";
import StudentSettings from "@/pages/student/StudentSettings";
import StudentCreatePost from "@/pages/student/CreatePost";

import AlumniDashboard from "@/pages/alumni/AlumniDashboard";
import AlumniProfile from "@/pages/alumni/AlumniProfile";
import EditAlumniProfile from "@/pages/alumni/EditAlumniProfile";
import AlumniSettings from "@/pages/alumni/AlumniSettings";
import AlumniCreatePost from "@/pages/alumni/CreatePost";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import PendingPosts from "@/pages/admin/PendingPosts";
import AllPosts from "@/pages/admin/AllPosts";
import ManageStudents from "@/pages/admin/ManageStudents";
import ManageAlumni from "@/pages/admin/ManageAlumni";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageAdmins from "@/pages/admin/ManageAdmins";
import AdminSettings from "@/pages/admin/AdminSettings";

import PostDetailPage from "@/pages/shared/PostDetailPage";
import NotFound from "@/pages/shared/NotFound";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
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
          <Outlet />
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
