import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userApi } from "@/api/user.api";
import PageWrapper from "@/components/layout/PageWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
type EmailValues = z.infer<typeof emailSchema>;

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type PasswordValues = z.infer<typeof passwordSchema>;

export default function StudentSettings() {
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onEmailSubmit = async (data: EmailValues) => {
    setEmailLoading(true);
    try {
      await userApi.updateMeAccount({ email: data.email });
      toast.success("Email updated successfully");
      emailForm.reset();
    } catch {
      toast.error("Failed to update email");
    } finally {
      setEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordValues) => {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Email</h2>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <Input
              label="New Email"
              type="email"
              {...emailForm.register("email")}
              error={emailForm.formState.errors.email?.message}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={emailLoading}>
                Update Email
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              {...passwordForm.register("oldPassword")}
              error={passwordForm.formState.errors.oldPassword?.message}
            />
            <Input
              label="New Password"
              type="password"
              {...passwordForm.register("newPassword")}
              error={passwordForm.formState.errors.newPassword?.message}
            />
            <Input
              label="Confirm New Password"
              type="password"
              {...passwordForm.register("confirmPassword")}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={passwordLoading}>
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
