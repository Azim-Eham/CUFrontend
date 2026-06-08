import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { adminApi } from "@/api/admin.api";

const registerSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  adminId: z.string().min(1, "Admin ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  designation: z.string().min(1, "Designation is required"),
  contactNo: z.string().min(1, "Contact number is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!token) {
      toast.error("Invalid registration link");
      return;
    }
    setLoading(true);
    try {
      await adminApi.register({
        token,
        password: data.password,
        admin: {
          adminId: data.adminId,
          name: { firstName: data.firstName, lastName: data.lastName },
          designation: data.designation,
          contactNo: data.contactNo,
        },
      });
      setSuccess(true);
      toast.success("Admin account created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <PageWrapper maxWidth="sm" className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <Card className="w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900">Invalid Link</h2>
          <p className="mt-2 text-sm text-gray-500">
            This admin registration link is invalid or missing a token.
          </p>
          <Link to="/login">
            <Button className="mt-6" size="lg">
              Go to Login
            </Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  if (success) {
    return (
      <PageWrapper maxWidth="sm" className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <Card className="w-full text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Registration Complete</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your admin account has been created. You can now log in.
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
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-950" />
            <CardTitle>Admin Registration</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              placeholder="John"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>
          <Input
            label="Admin ID"
            placeholder="e.g. ADM001"
            {...register("adminId")}
            error={errors.adminId?.message}
          />
          <Input
            label="Designation"
            placeholder="e.g. System Administrator"
            {...register("designation")}
            error={errors.designation?.message}
          />
          <Input
            label="Contact Number"
            placeholder="+880..."
            {...register("contactNo")}
            error={errors.contactNo?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            <Shield className="h-4 w-4" />
            Complete Registration
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Log in
          </Link>
        </p>
      </Card>
    </PageWrapper>
  );
}
