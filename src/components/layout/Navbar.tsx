import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { GraduationCap, LogOut, Menu, X, User, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "alumni" ? "/alumni" : "/student";
  const profilePath = user?.role === "admin" ? "/admin/settings" : user?.role === "alumni" ? "/alumni/profile" : "/student/profile";

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={isAuthenticated ? dashboardPath : "/"} className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary-950" />
          <span className="text-xl font-bold text-primary-950">CU Connect</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/mentors"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Browse Mentors
              </Link>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-primary-950 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to={dashboardPath}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/mentors"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Mentors
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:inline">{user?.email?.split("@")[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                      <Link
                        to={profilePath}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to={dashboardPath === "/admin" ? "/admin/settings" : `/${user?.role}/settings`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link to="/mentors" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Browse Mentors
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="rounded-lg bg-primary-950 px-3 py-2 text-center text-sm font-medium text-white">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Dashboard
              </Link>
              <Link to="/mentors" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Mentors
              </Link>
              <Link to={profilePath} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </Link>
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
