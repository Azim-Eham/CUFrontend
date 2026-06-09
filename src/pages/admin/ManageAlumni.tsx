import { useEffect, useState, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { alumniApi } from "@/api/alumni.api";
import { userApi } from "@/api/user.api";
import type { Alumni } from "@/types/alumni.types";
import type { User } from "@/types/auth.types";
import type { PaginatedResponse } from "@/types/api.types";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { Eye, Mail, Building2, MapPin } from "lucide-react";

export default function ManageAlumni() {
  const { page, limit, goToPage } = usePagination(1, 10);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPage: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const res = await alumniApi.getAll({
        page,
        limit,
        searchTerm: debouncedSearch || undefined,
      });
      const data: PaginatedResponse<Alumni> = res.data;
      setAlumni(data.data.result);
      setMeta({ total: data.data.meta.total, totalPage: data.data.meta.totalPage });
    } catch {
      toast.error("Failed to fetch alumni");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, debouncedSearch]);

  const handleBulkBlock = async () => {
    if (!confirm(`Block ${selectedIds.length} selected alumni users?`)) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const item = alumni.find((a) => a._id === id);
          if (item) {
            const userId = typeof item.userId === "object" ? item.userId._id : item.userId;
            await userApi.updateById(userId, { status: "blocked" });
          }
        })
      );
      toast.success("Selected alumni users blocked successfully");
      setSelectedIds([]);
      fetchAlumni();
    } catch {
      toast.error("Failed to block some alumni");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (alumni: Alumni) => {
    const profile = alumni.alumniProfile;
    if (!profile) return "—";
    return profile.alumniCategory || "—";
  };

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Alumni</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage alumni accounts
        </p>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search alumni by name, email, ID..."
          className="max-w-md w-full"
        />
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg py-1.5 px-3 animate-fadeInUp">
            <span className="text-xs font-semibold text-red-700">
              {selectedIds.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-650 border-red-200 hover:bg-red-600 hover:text-red-700 py-1 h-auto"
              onClick={handleBulkBlock}
            >
              Bulk Block
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : alumni.length === 0 ? (
        <EmptyState
          title="No alumni found"
          description="No alumni match your search."
        />
      ) : (
        <>
          <div className="space-y-3">
            {alumni.map((item) => {
              const user =
                typeof item.userId === "object"
                  ? (item.userId as User)
                  : null;

              return (
                <Card key={item._id} className={`p-4 transition-all duration-300 ${selectedIds.includes(item._id) ? "bg-primary-50/40 border-primary-200" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [...prev, item._id]);
                          } else {
                            setSelectedIds((prev) => prev.filter((id) => id !== item._id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer mr-1"
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                        {item.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <Badge variant="warning">
                            {getCategoryLabel(item)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {item.studentId} &middot; {user?.email || "—"}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                          <span>{item.department}</span>
                          <span>Batch {item.graduationYear}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAlumni(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={goToPage}
          />
        </>
      )}

      <Modal
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title="Alumni Details"
      >
        {selectedAlumni && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700">
                {selectedAlumni.name[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedAlumni.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedAlumni.studentId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                {typeof selectedAlumni.userId === "object"
                  ? selectedAlumni.userId.email
                  : "—"}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4" />
                {selectedAlumni.department}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                {selectedAlumni.location?.city && selectedAlumni.location?.country
                  ? `${selectedAlumni.location.city}, ${selectedAlumni.location.country}`
                  : "—"}
              </div>
              <div className="text-gray-600">
                Graduated: {selectedAlumni.graduationYear}
              </div>
            </div>

            {selectedAlumni.bio && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Bio</p>
                <p className="text-sm text-gray-700">{selectedAlumni.bio}</p>
              </div>
            )}

            {selectedAlumni.achievements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Achievements
                </p>
                <div className="space-y-1">
                  {selectedAlumni.achievements.map((ach, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      {ach.title} {ach.year && <span className="text-gray-400">({ach.year})</span>}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
