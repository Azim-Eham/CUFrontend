import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  FileCheck,
  FileText,
  Users,
  GraduationCap,
  UserCog,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts/pending", label: "Pending Posts", icon: FileCheck },
  { to: "/admin/posts/all", label: "All Posts", icon: FileText },
  { to: "/admin/students", label: "Students", icon: GraduationCap },
  { to: "/admin/alumni", label: "Alumni", icon: Users },
  { to: "/admin/users", label: "User Accounts", icon: UserCog },
  { to: "/admin/admins", label: "Admins", icon: Shield },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs transition-opacity md:hidden"
        />
      )}

      <aside
        className={cn(
          // Mobile styles: slide-out drawer
          "fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop overrides: standard sidebar
          "md:sticky md:top-16 md:bottom-auto md:left-auto md:h-[calc(100vh-4rem)] md:z-10 md:translate-x-0 md:transition-all",
          collapsed ? "md:w-16" : "md:w-60"
        )}
      >
        <div className="flex h-full flex-col">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-10 w-full items-center justify-center border-b border-gray-100 text-gray-400 hover:text-gray-600"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    collapsed && "md:justify-center md:px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className={cn(collapsed && "md:hidden")}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
