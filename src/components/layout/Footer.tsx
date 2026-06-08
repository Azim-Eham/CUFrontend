import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const links = [
  { label: "Browse Mentors", to: "/mentors" },
  { label: "Sign Up", to: "/signup" },
  { label: "Log In", to: "/login" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-950">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-primary-950">CUPC</span>
              <p className="text-xs text-gray-400">CU Students & Alumni</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CUPC — Chittagong University Platform for Connection. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
