import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import PasswordStrength from "@/components/ui/PasswordStrength";
import {
  PROGRAMS,
  Genders,
  ALUMNI_CATEGORIES,
} from "@/utils/constants";

const baseSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  session: z.string().min(1, "Session is required"),
  department: z.string().min(1, "Department is required"),
  faculty: z.string().min(1, "Faculty is required"),
});

const studentSchema = baseSchema.extend({
  currentProgram: z.enum(PROGRAMS, { error: "Required" }),
  currentYear: z.string().min(1, "Required"),
});

const alumniSchema = baseSchema.extend({
  gender: z.enum(Genders, { error: "Required" }),
  graduationYear: z.coerce.number().min(1900, "Invalid year"),
  contactNumber: z.string().min(1, "Contact number is required"),
  willingToMentor: z.boolean(),
  locationCountry: z.string().min(1, "Country is required"),
  locationCity: z.string().min(1, "City is required"),
  alumniCategory: z.string().min(1, "Category is required"),
});

type StudentFormData = z.infer<typeof studentSchema>;
type AlumniFormData = z.infer<typeof alumniSchema>;

export default function SignupPage() {
  const { signupStudent, signupAlumni } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"student" | "alumni" | null>(null);
  const [loading, setLoading] = useState(false);

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues: { currentYear: "" },
  });

  const alumniForm = useForm<AlumniFormData>({
    resolver: zodResolver(alumniSchema) as any,
    defaultValues: { willingToMentor: false },
  });

  const handleRoleSelect = (selected: "student" | "alumni") => {
    setRole(selected);
    setStep(2);
  };

  const handleStudentSubmit = async (data: StudentFormData) => {
    setLoading(true);
    const payload = {
      email: data.email,
      password: data.password,
      student: {
        studentId: data.studentId,
        name: data.name,
        session: data.session,
        department: data.department,
        faculty: data.faculty,
        studyInfo: {
          currentProgram: data.currentProgram,
          currentYear: Number(data.currentYear),
        },
      },
    };
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await signupStudent(payload);
        return;
      } catch (err: any) {
        if (attempt === 1) {
          const msg =
            err?.response?.data?.errorMessage ||
            err?.response?.data?.errorSource?.map((e: any) => e.message).join(", ") ||
            err?.response?.data?.message ||
            err?.message ||
            "Signup failed";
          toast.error(msg);
        }
      }
    }
    setLoading(false);
  };

  const handleAlumniSubmit = async (data: AlumniFormData) => {
    setLoading(true);
    const payload = {
      email: data.email,
      password: data.password,
      alumni: {
        studentId: data.studentId,
        name: data.name,
        gender: data.gender,
        graduationYear: data.graduationYear,
        contactNumber: data.contactNumber,
        session: data.session,
        department: data.department,
        faculty: data.faculty,
        willingToMentor: data.willingToMentor,
        location: { country: data.locationCountry, city: data.locationCity },
        alumniProfile: {
          alumniCategory: data.alumniCategory,
        },
      },
    };
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await signupAlumni(payload);
        return;
      } catch (err: any) {
        if (attempt === 1) {
          const msg =
            err?.response?.data?.errorMessage ||
            err?.response?.data?.errorSource?.map((e: any) => e.message).join(", ") ||
            err?.response?.data?.message ||
            err?.message ||
            "Signup failed";
          toast.error(msg);
        }
      }
    }
    setLoading(false);
  };

  return (
    <PageWrapper maxWidth="sm" className="py-12">
      {/* Step Progress Bar */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
            step >= 1 ? "bg-primary-600 text-white shadow-sm" : "bg-gray-200 text-gray-600"
          }`}>
            1
          </div>
          <span className={`text-xs font-semibold ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}>Choose Role</span>
        </div>
        <div className={`h-0.5 flex-1 mx-4 transition-all duration-500 ${step >= 2 ? "bg-primary-600" : "bg-gray-200"}`} />
        <div className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
            step === 2 ? "bg-primary-600 text-white shadow-sm" : "bg-gray-200 text-gray-600"
          }`}>
            2
          </div>
          <span className={`text-xs font-semibold ${step === 2 ? "text-gray-900" : "text-gray-400"}`}>Details</span>
        </div>
      </div>

      {step === 1 ? (
        <Card className="w-full glass shadow-xl border-white/40 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="mt-2 text-sm text-gray-500">Choose your role to get started</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => handleRoleSelect("student")}
              className="flex flex-col items-center gap-4 rounded-xl border-2 border-gray-200 p-8 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-950">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Student</h3>
                <p className="mt-1 text-sm text-gray-500">Currently studying at CU</p>
              </div>
            </button>
            <button
              onClick={() => handleRoleSelect("alumni")}
              className="flex flex-col items-center gap-4 rounded-xl border-2 border-gray-200 p-8 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Briefcase className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Alumni</h3>
                <p className="mt-1 text-sm text-gray-500">Graduated from CU</p>
              </div>
            </button>
          </div>
        </Card>
      ) : (
        <Card className="w-full glass shadow-xl border-white/40">
          <CardHeader>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setStep(1); setRole(null); }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <CardTitle>
                {role === "student" ? "Student Registration" : "Alumni Registration"}
              </CardTitle>
            </div>
          </CardHeader>

          {role === "student" ? (
            <form onSubmit={studentForm.handleSubmit(handleStudentSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Student ID"
                  placeholder="e.g. 200041234"
                  {...studentForm.register("studentId")}
                  error={studentForm.formState.errors.studentId?.message}
                />
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...studentForm.register("name")}
                  error={studentForm.formState.errors.name?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  {...studentForm.register("email")}
                  error={studentForm.formState.errors.email?.message}
                />
                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min. 6 characters"
                    {...studentForm.register("password")}
                    error={studentForm.formState.errors.password?.message}
                  />
                  <PasswordStrength password={studentForm.watch("password")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Session"
                  placeholder="e.g. 2019-20"
                  {...studentForm.register("session")}
                  error={studentForm.formState.errors.session?.message}
                />
                <Input
                  label="Department"
                  placeholder="e.g. CSE"
                  {...studentForm.register("department")}
                  error={studentForm.formState.errors.department?.message}
                />
                <Input
                  label="Faculty"
                  placeholder="e.g. Science"
                  {...studentForm.register("faculty")}
                  error={studentForm.formState.errors.faculty?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Current Program"
                  placeholder="Select program"
                  options={PROGRAMS.map((p) => ({ value: p, label: p }))}
                  {...studentForm.register("currentProgram")}
                  error={studentForm.formState.errors.currentProgram?.message}
                />
                <Select
                  label="Current Year"
                  placeholder="Select year"
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "Masters" },
                  ]}
                  {...studentForm.register("currentYear")}
                  error={studentForm.formState.errors.currentYear?.message}
                />
              </div>
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={alumniForm.handleSubmit(handleAlumniSubmit as any)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Student ID"
                  placeholder="e.g. 200041234"
                  {...alumniForm.register("studentId")}
                  error={alumniForm.formState.errors.studentId?.message}
                />
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...alumniForm.register("name")}
                  error={alumniForm.formState.errors.name?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  {...alumniForm.register("email")}
                  error={alumniForm.formState.errors.email?.message}
                />
                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min. 6 characters"
                    {...alumniForm.register("password")}
                    error={alumniForm.formState.errors.password?.message}
                  />
                  <PasswordStrength password={alumniForm.watch("password")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  options={Genders.map((g) => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))}
                  {...alumniForm.register("gender")}
                  error={alumniForm.formState.errors.gender?.message}
                />
                <Input
                  label="Graduation Year"
                  type="number"
                  min={1900}
                  {...alumniForm.register("graduationYear")}
                  error={alumniForm.formState.errors.graduationYear?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Contact Number"
                  placeholder="+880..."
                  {...alumniForm.register("contactNumber")}
                  error={alumniForm.formState.errors.contactNumber?.message}
                />
                <Select
                  label="Alumni Category"
                  placeholder="Select category"
                  options={ALUMNI_CATEGORIES.map((c) => ({
                    value: c,
                    label: c.charAt(0).toUpperCase() + c.slice(1),
                  }))}
                  {...alumniForm.register("alumniCategory")}
                  error={alumniForm.formState.errors.alumniCategory?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Session"
                  placeholder="e.g. 2015-19"
                  {...alumniForm.register("session")}
                  error={alumniForm.formState.errors.session?.message}
                />
                <Input
                  label="Department"
                  placeholder="e.g. CSE"
                  {...alumniForm.register("department")}
                  error={alumniForm.formState.errors.department?.message}
                />
                <Input
                  label="Faculty"
                  placeholder="e.g. Science"
                  {...alumniForm.register("faculty")}
                  error={alumniForm.formState.errors.faculty?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Country"
                  placeholder="e.g. Bangladesh"
                  {...alumniForm.register("locationCountry")}
                  error={alumniForm.formState.errors.locationCountry?.message}
                />
                <Input
                  label="City"
                  placeholder="e.g. Dhaka"
                  {...alumniForm.register("locationCity")}
                  error={alumniForm.formState.errors.locationCity?.message}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...alumniForm.register("willingToMentor")}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                I am willing to mentor current students
              </label>
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Log in
            </Link>
          </p>
        </Card>
      )}
    </PageWrapper>
  );
}
