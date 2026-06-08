import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { userApi } from "@/api/user.api";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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

export default function AlumniSettings() {
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setEmailLoading(true);
    try {
      await userApi.updateMeAccount({ email: data.email });
      toast.success("Email updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update email");
    } finally {
      setEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    try {
      await userApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      resetPassword();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PageWrapper maxWidth="md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Change Email
              </span>
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-4">
            <Input
              label="New Email"
              type="email"
              placeholder="you@example.com"
              {...registerEmail("email")}
              error={emailErrors.email?.message}
            />
            <Button type="submit" loading={emailLoading}>
              Update Email
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </span>
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              {...registerPassword("oldPassword")}
              error={passwordErrors.oldPassword?.message}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              {...registerPassword("newPassword")}
              error={passwordErrors.newPassword?.message}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              {...registerPassword("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
            />
            <Button type="submit" loading={passwordLoading}>
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    </PageWrapper>
  );
}
