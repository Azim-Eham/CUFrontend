import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-500">Page not found</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </PageWrapper>
  );
}
