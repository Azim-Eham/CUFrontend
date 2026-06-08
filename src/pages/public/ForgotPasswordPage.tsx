import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, KeyRound, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordStrength from "@/components/ui/PasswordStrength";
import { authApi } from "@/api/auth.api";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const handleSendOtp = async (data: EmailFormData) => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: data.email });
      setEmail(data.email);
      setStep("reset");
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (data: ResetFormData) => {
    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
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
        <Card className="w-full text-center glass shadow-xl border-white/40">
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
      <Card className="w-full glass shadow-xl border-white/40">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        </CardHeader>

        {step === "email" ? (
          <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
            <p className="text-center text-sm text-gray-500">
              Enter your email address and we&apos;ll send you a one-time code to reset your password.
            </p>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...emailForm.register("email")}
              error={emailForm.formState.errors.email?.message}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              <Mail className="h-4 w-4" />
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
            <p className="text-center text-sm text-gray-500">
              Enter the OTP sent to <span className="font-medium text-gray-700">{email}</span> and your new password.
            </p>
            <Input
              label="OTP"
              placeholder="Enter 6-digit code"
              {...resetForm.register("otp")}
              error={resetForm.formState.errors.otp?.message}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              {...resetForm.register("newPassword")}
              error={resetForm.formState.errors.newPassword?.message}
            />
            <PasswordStrength password={resetForm.watch("newPassword")} />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              {...resetForm.register("confirmPassword")}
              error={resetForm.formState.errors.confirmPassword?.message}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              <KeyRound className="h-4 w-4" />
              Reset Password
            </Button>
          </form>
        )}

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
