import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email or Student ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const isEmail = data.email.includes("@");
    const payload = isEmail
      ? { email: data.email, password: data.password }
      : { id: data.email, password: data.password };
    try {
      await login(payload);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errorSources?.map((e: any) => e.message).join(", ") ||
        err?.message ||
        "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper maxWidth="sm" className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <Card className="w-full glass shadow-xl border-white/40">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Log in to CUPC</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email or Student ID"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password?.message}
          />
          <div className="flex items-center justify-end text-sm">
            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">
            <LogIn className="h-4 w-4" />
            Log in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </Card>
    </PageWrapper>
  );
}
