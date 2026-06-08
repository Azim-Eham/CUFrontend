import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary-950" />
            <span className="font-semibold text-primary-950">CUPC</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CUPC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
