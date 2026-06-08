import { useEffect, useState, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { adminApi } from "@/api/admin.api";
import type { Admin } from "@/types/admin.types";
import type { PaginatedResponse } from "@/types/api.types";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { UserPlus, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function ManageAdmins() {
  const { page, limit, goToPage } = usePagination(1, 10);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPage: 0 });
  const [loading, setLoading] = useState(true);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAll({ page, limit });
      const data: PaginatedResponse<Admin> = res.data;
      setAdmins(data.data.result);
      setMeta({ total: data.data.meta.total, totalPage: data.data.meta.totalPage });
    } catch {
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page]);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected admins?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => adminApi.delete(id)));
      toast.success("Selected admins deleted successfully");
      setSelectedIds([]);
      fetchAdmins();
    } catch {
      toast.error("Failed to delete some admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleInvite = async (data: InviteFormData) => {
    setInviteLoading(true);
    try {
      await adminApi.invite(data.email);
      toast.success("Admin invitation sent");
      setInviteModal(false);
      reset();
    } catch {
      toast.error("Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 animate-fadeInUp">Manage Admins</h1>
          <p className="mt-1 text-sm text-gray-500">View and invite administrators</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button onClick={() => setInviteModal(true)}>
            <UserPlus className="h-4 w-4" /> Invite Admin
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : admins.length === 0 ? (
        <EmptyState
          title="No admins found"
          description="Invite an admin to get started."
        />
      ) : (
        <>
          <div className="space-y-3">
            {admins.map((admin) => (
              <Card key={admin._id} className={`p-4 transition-all duration-300 ${selectedIds.includes(admin.adminId) ? "bg-primary-50/40 border-primary-200" : ""}`}>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(admin.adminId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, admin.adminId]);
                      } else {
                        setSelectedIds((prev) => prev.filter((id) => id !== admin.adminId));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer mr-1"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
                    {admin.name.firstName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {admin.name.firstName} {admin.name.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {admin.adminId} &middot; {admin.designation}
                    </p>
                  </div>
                  {admin.contactNo && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="h-3.5 w-3.5" />
                      {admin.contactNo}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={goToPage}
          />
        </>
      )}

      <Modal
        isOpen={inviteModal}
        onClose={() => {
          setInviteModal(false);
          reset();
        }}
        title="Invite Admin"
      >
        <form onSubmit={handleSubmit(handleInvite)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInviteModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={inviteLoading}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
