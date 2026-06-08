import { useEffect, useState, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { userApi } from "@/api/user.api";
import type { User } from "@/types/auth.types";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react";

const ROLE_BADGE: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "info"> = {
  student: "primary",
  alumni: "warning",
  admin: "danger",
  teacher: "info",
};

const STATUS_BADGE: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "info"> = {
  active: "success",
  blocked: "danger",
  pending: "warning",
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      let data: User[] = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data.result || [];

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        data = data.filter(
          (u) =>
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        );
      }

      if (roleFilter) {
        data = data.filter((u) => u.role === roleFilter);
      }

      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    setActionLoading(user._id);
    try {
      await userApi.updateById(user._id, { status: newStatus });
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete user ${user.email}?`)) return;
    try {
      await userApi.delete(user._id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <PageWrapper maxWidth="xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage user accounts</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by email..."
          className="max-w-md"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No users match your search."
        />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-medium text-gray-600">ID</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Verified</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {user._id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_BADGE[user.role] || "default"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[user.status] || "default"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <span className="text-green-600 text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={actionLoading === user._id}
                          onClick={() => handleToggleStatus(user)}
                          title={
                            user.status === "active" ? "Block user" : "Unblock user"
                          }
                        >
                          {user.status === "active" ? (
                            <ShieldOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageWrapper>
  );
}
