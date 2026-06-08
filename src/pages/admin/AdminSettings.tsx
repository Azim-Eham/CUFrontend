import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import InfoSection from "@/components/profiles/InfoSection";
import { userApi } from "@/api/user.api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});
type EmailFormData = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminSettings() {
  const { user } = useAuthStore();
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user?.email || "" },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    setEmailLoading(true);
    try {
      await userApi.updateMeAccount({ email: data.email });
      toast.success("Email updated successfully");
    } catch {
      toast.error("Failed to update email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    try {
      await userApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch {
      toast.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PageWrapper maxWidth="md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        <InfoSection title="Account Information">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-700">Email:</span>{" "}
              <span className="text-gray-600">{user?.email}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Role:</span>{" "}
              <span className="text-gray-600 capitalize">{user?.role}</span>
            </p>
          </div>
        </InfoSection>

        <InfoSection title="Change Email">
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
            <Input
              label="New Email"
              type="email"
              placeholder="new-email@example.com"
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register("email")}
            />
            <Button type="submit" loading={emailLoading}>
              Update Email
            </Button>
          </form>
        </InfoSection>

        <InfoSection title="Change Password">
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-4"
          >
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              error={passwordForm.formState.errors.oldPassword?.message}
              {...passwordForm.register("oldPassword")}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register("newPassword")}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register("confirmPassword")}
            />
            <Button type="submit" loading={passwordLoading}>
              Change Password
            </Button>
          </form>
        </InfoSection>
      </div>
    </PageWrapper>
  );
}
