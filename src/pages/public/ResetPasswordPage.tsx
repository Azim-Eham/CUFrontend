import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authApi } from "@/api/auth.api";

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(1, "OTP is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: prefillEmail },
  });

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true);
    try {
      await authApi.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      toast.success("Password reset successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageWrapper maxWidth="sm" className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <Card className="w-full text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Password Reset Successful</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your password has been updated. You can now log in with your new password.
          </p>
          <Link to="/login">
            <Button className="mt-6 w-full" size="lg">
              Go to Login
            </Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="sm" className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
            disabled={!!prefillEmail}
          />
          <Input
            label="OTP"
            placeholder="Enter 6-digit code"
            {...register("otp")}
            error={errors.otp?.message}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 6 characters"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            <KeyRound className="h-4 w-4" />
            Reset Password
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Log in
          </Link>
        </p>
      </Card>
    </PageWrapper>
  );
}
