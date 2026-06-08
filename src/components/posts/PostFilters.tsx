import { POST_TYPES, POST_TYPE_LABELS } from "@/utils/constants";

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
}

export default function PostFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
}: PostFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search posts..."
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <option value="">All Types</option>
        {POST_TYPES.map((t) => (
          <option key={t} value={t}>
            {POST_TYPE_LABELS[t]}
          </option>
        ))}
      </select>
    </div>
  );
}
