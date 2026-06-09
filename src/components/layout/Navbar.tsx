import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import {
  GraduationCap,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Compass,
  UserPlus,
  LogIn,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "alumni" ? "/alumni" : "/student";
  const profilePath = user?.role === "admin" ? "/admin/settings" : user?.role === "alumni" ? "/alumni/profile" : "/student/profile";

  // Check if a path is active for styling
  const isHomeActive = location.pathname === (isAuthenticated ? dashboardPath : "/") || location.pathname.startsWith("/posts");
  const isMentorsActive = location.pathname.startsWith("/mentors");
  const isProfileActive = location.pathname.includes("/profile");
  const isSettingsActive = location.pathname.endsWith("/settings");

  return (
    <>
      {/* Desktop Navbar (sticky top, hidden on mobile) */}
      <nav className="hidden md:block sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to={isAuthenticated ? dashboardPath : "/"} className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary-950" />
            <span className="text-xl font-bold text-primary-950">CUPC</span>
          </Link>

          {/* Desktop Links */}
          <div className="flex items-center gap-3">
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
                {user?.role === "admin" && (
                  <Link
                    to={dashboardPath}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                )}
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
        </div>
      </nav>

      {/* Mobile Navbar (fixed bottom, hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex h-16 items-center justify-around px-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                  location.pathname === "/" ? "text-primary-950 scale-105" : "text-gray-500"
                )}
              >
                <GraduationCap className="h-5 w-5 mb-0.5" />
                <span>Home</span>
              </Link>
              <Link
                to="/mentors"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                  isMentorsActive ? "text-primary-950 scale-105" : "text-gray-500"
                )}
              >
                <Compass className="h-5 w-5 mb-0.5" />
                <span>Mentors</span>
              </Link>
              <Link
                to="/login"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                  location.pathname === "/login" ? "text-primary-950 scale-105" : "text-gray-500"
                )}
              >
                <LogIn className="h-5 w-5 mb-0.5" />
                <span>Log in</span>
              </Link>
              <Link
                to="/signup"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                  location.pathname === "/signup" ? "text-primary-950 scale-105" : "text-gray-500"
                )}
              >
                <UserPlus className="h-5 w-5 mb-0.5" />
                <span>Sign up</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to={dashboardPath}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                  isHomeActive ? "text-primary-950 scale-105" : "text-gray-500"
                )}
              >
                {user?.role === "admin" ? (
                  <LayoutDashboard className="h-5 w-5 mb-0.5" />
                ) : (
                  <GraduationCap className="h-5 w-5 mb-0.5" />
                )}
                <span>Home</span>
              </Link>
              <Link
                to="/mentors"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                  isMentorsActive ? "text-primary-950 scale-105" : "text-gray-500"
                )}
              >
                <Compass className="h-5 w-5 mb-0.5" />
                <span>Mentors</span>
              </Link>

              {user?.role === "admin" ? (
                <>
                  <button
                    onClick={onMenuToggle}
                    className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Menu className="h-5 w-5 mb-0.5" />
                    <span>Menu</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={profilePath}
                    className={cn(
                      "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                      isProfileActive ? "text-primary-950 scale-105" : "text-gray-500"
                    )}
                  >
                    <User className="h-5 w-5 mb-0.5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to={`/${user?.role}/settings`}
                    className={cn(
                      "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200",
                      isSettingsActive ? "text-primary-950 scale-105" : "text-gray-500"
                    )}
                  >
                    <Settings className="h-5 w-5 mb-0.5" />
                    <span>Settings</span>
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mb-0.5" />
                <span>Log out</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
