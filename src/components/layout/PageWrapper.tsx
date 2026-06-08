import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export default function PageWrapper({ children, className = "", maxWidth = "lg" }: PageWrapperProps) {
  return (
    <main className={`mx-auto w-full px-4 py-8 sm:px-6 ${maxWidths[maxWidth]} ${className}`}>
      {children}
    </main>
  );
}
