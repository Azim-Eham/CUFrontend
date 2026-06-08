import { useEffect, useState } from "react";
import { MapPin, Info, Send } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { alumniApi } from "@/api/alumni.api";
import { mentorshipApi } from "@/api/mentorship.api";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { truncate } from "@/utils/formatters";
import { ALUMNI_CATEGORIES } from "@/utils/constants";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import type { Alumni } from "@/types/alumni.types";
import type { PaginatedResponse } from "@/types/api.types";

export default function MentorsPage() {
  const { user } = useAuthStore();
  const { page, limit, goToPage } = usePagination(1, 12);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [mentors, setMentors] = useState<Alumni[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedMentor, setSelectedMentor] = useState<Alumni | null>(null);
  const [requestMentor, setRequestMentor] = useState<Alumni | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setLoading(true);
    alumniApi
      .getMentors({
        page,
        limit,
        searchTerm: debouncedSearch || undefined,
        alumniCategory: categoryFilter || undefined,
        graduationYear: yearFilter ? Number(yearFilter) : undefined,
      })
      .then((res) => {
        const data: PaginatedResponse<Alumni> = res.data;
        setMentors(data.data.result);
        setTotalPage(data.data.meta.totalPage);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, limit, debouncedSearch, categoryFilter, yearFilter]);

  const handleRequestMentorship = async () => {
    if (!requestMentor) return;
    setRequesting(true);
    try {
      await mentorshipApi.createRequest({
        mentorId: requestMentor._id,
        message: requestMessage,
      });

      toast.success(`Mentorship request successfully sent to ${requestMentor.name}!`);
      setRequestMessage("");
      setRequestMentor(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to send mentorship request.";
      toast.error(errMsg);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <PageWrapper maxWidth="lg" className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Browse Mentors</h1>
        <p className="mt-2 text-gray-500">
          Find experienced Chittagong University alumni ready to guide your academic and career journey.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4 items-end">
        <div className="md:col-span-2">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); goToPage(1); }}
            placeholder="Search by name, department..."
            className="w-full"
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); goToPage(1); }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {ALUMNI_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="number"
            placeholder="Graduation Year"
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); goToPage(1); }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : mentors.length === 0 ? (
        <EmptyState title="No mentors found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <Card key={m._id} className="flex flex-col hover:shadow-lg transition-all duration-300 border-gray-150 glass" hover>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 shadow-inner">
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
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge variant="primary">{m.alumniProfile?.alumniCategory || "Alumni"}</Badge>
                  <Badge>Class of {m.graduationYear}</Badge>
                  {m.willingToMentor && <Badge variant="success">Mentor</Badge>}
                </div>
                {m.location && (
                  <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {m.location.city}, {m.location.country}
                  </p>
                )}
                {m.bio && (
                  <p className="mb-4 mt-1 text-sm text-gray-600 line-clamp-3 leading-relaxed">{truncate(m.bio, 120)}</p>
                )}
                
                <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedMentor(m)}
                  >
                    <Info className="h-3.5 w-3.5 mr-1" />
                    Info
                  </Button>
                  {m.willingToMentor && user?.role === "student" && (
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setRequestMentor(m)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Request
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPage={totalPage} onPageChange={goToPage} />
        </>
      )}

      {/* Mentor Detail Modal */}
      <Modal
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
        title="Mentor Profile"
      >
        {selectedMentor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                {selectedMentor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedMentor.name}</h3>
                <p className="text-sm text-gray-500">{selectedMentor.department}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge variant="primary">{selectedMentor.alumniProfile?.alumniCategory}</Badge>
                  <Badge>Class of {selectedMentor.graduationYear}</Badge>
                  {selectedMentor.willingToMentor && <Badge variant="success">Available for Mentorship</Badge>}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {selectedMentor.bio && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Biography</h4>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">{selectedMentor.bio}</p>
                </div>
              )}

              {selectedMentor.location && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</h4>
                  <p className="mt-1 text-sm text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {selectedMentor.location.city}, {selectedMentor.location.country}
                  </p>
                </div>
              )}

              {selectedMentor.achievements && selectedMentor.achievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Achievements</h4>
                  <div className="space-y-2">
                    {selectedMentor.achievements.map((ach, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-2 text-xs border border-gray-100">
                        <div className="font-semibold text-gray-800">{ach.title}</div>
                        {ach.description && <div className="text-gray-500 mt-0.5">{ach.description}</div>}
                        <div className="text-gray-400 mt-0.5">{ach.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                Close
              </Button>
              {selectedMentor.willingToMentor && user?.role === "student" && (
                <Button
                  onClick={() => {
                    setRequestMentor(selectedMentor);
                    setSelectedMentor(null);
                  }}
                >
                  Request Mentorship
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Request Mentorship Modal */}
      <Modal
        isOpen={!!requestMentor}
        onClose={() => {
          setRequestMentor(null);
          setRequestMessage("");
        }}
        title={`Request Mentorship`}
      >
        {requestMentor && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Write a brief message explaining your goals and what you hope to achieve with guidance from <span className="font-semibold text-gray-800">{requestMentor.name}</span>.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Your Message</label>
              <textarea
                rows={5}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400"
                placeholder="Hi! I am studying computer science and I'm very interested in your career path. I would love to get your mentorship..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => {
                  setRequestMentor(null);
                  setRequestMessage("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestMentorship}
                loading={requesting}
                disabled={!requestMessage.trim()}
              >
                Send Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
