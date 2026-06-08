import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { alumniApi } from "@/api/alumni.api";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { truncate } from "@/utils/formatters";
import type { Alumni } from "@/types/alumni.types";
import type { PaginatedResponse } from "@/types/api.types";

export default function MentorsPage() {
  const { page, limit, goToPage } = usePagination(1, 12);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [mentors, setMentors] = useState<Alumni[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    alumniApi
      .getMentors({ page, limit, searchTerm: debouncedSearch || undefined })
      .then((res) => {
        const data: PaginatedResponse<Alumni> = res.data;
        setMentors(data.data.result);
        setTotalPage(data.data.meta.totalPage);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, limit, debouncedSearch]);

  return (
    <PageWrapper maxWidth="lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Mentors</h1>
        <p className="mt-2 text-gray-500">
          Find experienced alumni ready to guide your journey.
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={(v) => { setSearch(v); goToPage(1); }}
        placeholder="Search by name, department, or category..."
        className="mb-8 max-w-md"
      />

      {loading ? (
        <LoadingSpinner />
      ) : mentors.length === 0 ? (
        <EmptyState title="No mentors found" description="Try adjusting your search criteria." />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <Card key={m._id} className="flex flex-col">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-900">{m.name}</h3>
                    <p className="text-xs text-gray-500">{m.department}</p>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="primary">{m.alumniProfile.alumniCategory}</Badge>
                  <Badge>Class of {m.graduationYear}</Badge>
                  {m.willingToMentor && <Badge variant="success">Mentor</Badge>}
                </div>
                {m.location && (
                  <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {m.location.city}, {m.location.country}
                  </p>
                )}
                {m.bio && (
                  <p className="mt-auto text-sm text-gray-600">{truncate(m.bio, 140)}</p>
                )}
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPage={totalPage} onPageChange={goToPage} />
        </>
      )}
    </PageWrapper>
  );
}
