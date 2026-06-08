import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200/80 shadow-sm",
        "transition-all duration-300 ease-out",
        padding && "p-6",
        hover && "card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900 tracking-tight", className)}>
      {children}
    </h3>
  );
}
