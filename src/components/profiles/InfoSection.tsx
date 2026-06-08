import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
}

export default function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}
