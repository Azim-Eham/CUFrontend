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
import { studentApi } from "@/api/student.api";
import type { Student } from "@/types/student.types";
import type { User } from "@/types/auth.types";
import type { PaginatedResponse } from "@/types/api.types";
import { timeAgo } from "@/utils/formatters";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { Eye, Trash2, Mail, Phone, BookOpen } from "lucide-react";

export default function ManageStudents() {
  const { page, limit, goToPage } = usePagination(1, 10);
  const [students, setStudents] = useState<Student[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPage: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAll({
        page,
        limit,
        searchTerm: debouncedSearch || undefined,
      });
      const data: PaginatedResponse<Student> = res.data;
      const activeStudents = data.data.result.filter((s) => {
        const user = typeof s.userId === "object" ? s.userId : null;
        return user && !user.isDeleted;
      });
      setStudents(activeStudents);
      setMeta({ total: data.data.meta.total, totalPage: data.data.meta.totalPage });
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (student: Student) => {
    if (!confirm(`Delete student ${student.name}?`)) return;
    try {
      const userId = typeof student.userId === "object" ? student.userId._id : student.userId;
      await studentApi.delete(student.studentId);
      toast.success("Student deleted");
      setSelectedIds((prev) => prev.filter((id) => id !== student.studentId));
      fetchStudents();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [page, debouncedSearch]);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected students?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => studentApi.delete(id)));
      toast.success("Selected students deleted successfully");
      setSelectedIds([]);
      fetchStudents();
    } catch {
      toast.error("Failed to delete some students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage student accounts
        </p>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search students by name, email, ID..."
          className="max-w-md"
        />
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg py-1.5 px-3 animate-fadeInUp">
            <span className="text-xs font-semibold text-red-700">
              {selectedIds.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-600 border-red-200 hover:bg-red-650 hover:text-red-700 py-1 h-auto"
              onClick={handleBulkDelete}
            >
              Bulk Delete
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : students.length === 0 ? (
        <EmptyState
          title="No students found"
          description="No students match your search."
        />
      ) : (
        <>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 font-medium text-gray-650 w-12">
                      <input
                        type="checkbox"
                        checked={students.length > 0 && selectedIds.length === students.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(students.map((s) => s.studentId));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-600">Student ID</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Department</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Session</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => {
                    const user =
                      typeof student.userId === "object"
                        ? (student.userId as User)
                        : null;

                    return (
                      <tr
                        key={student._id}
                        className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(student.studentId) ? "bg-primary-50/40" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student.studentId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, student.studentId]);
                              } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== student.studentId));
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">
                          {student.studentId}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {user?.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {student.department}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{student.session}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(student)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={goToPage}
          />
        </>
      )}

      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                {selectedStudent.name[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStudent.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedStudent.studentId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                {typeof selectedStudent.userId === "object"
                  ? selectedStudent.userId.email
                  : "—"}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                {selectedStudent.contactNumber || "—"}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-4 w-4" />
                {selectedStudent.department}
              </div>
              <div className="text-gray-600">
                Session: {selectedStudent.session}
              </div>
            </div>

            {selectedStudent.bio && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Bio</p>
                <p className="text-sm text-gray-700">{selectedStudent.bio}</p>
              </div>
            )}

            {selectedStudent.skills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {selectedStudent.skills.map((skill) => (
                    <Badge key={skill} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedStudent.interests.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Interests</p>
                <div className="flex flex-wrap gap-1">
                  {selectedStudent.interests.map((interest) => (
                    <Badge key={interest} variant="info">
                      {interest}
                    </Badge>
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
