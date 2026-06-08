import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="flex min-h-[calc(100vh-16rem)] items-center justify-center page-enter">
      <div className="relative flex flex-col items-center justify-center text-center p-8 max-w-md w-full">
        {/* Glow Effects */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl -z-10" />

        {/* Floating Illustration Container */}
        <div className="mb-8 relative select-none">
          <h1 className="text-9xl font-extrabold tracking-widest text-primary-950 font-sans float opacity-90">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 px-4 py-1.5 rounded-full border border-white/40 shadow-lg backdrop-blur-sm">
            <span className="text-sm font-semibold text-primary-600 tracking-wider uppercase">Page Not Found</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! You wander in space.</h2>
        <p className="text-sm text-gray-500 max-w-xs mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link to="/" className="flex sm:flex-1">
            <Button className="w-full flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
