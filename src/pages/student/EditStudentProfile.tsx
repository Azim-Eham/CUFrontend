import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { studentApi } from "@/api/student.api";
import type { Student } from "@/types/student.types";
import PageWrapper from "@/components/layout/PageWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().optional(),
  gender: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  profileImage: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  cvLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  portfolioLink: z.string().url("Must a valid URL").or(z.literal("")).optional(),
  socialMedia: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required"),
      link: z.string().url("Must be a valid URL").or(z.literal("")),
    })
  ),
  achievements: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      year: z.coerce.number().min(1900, "Invalid year").max(2100, "Invalid year"),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export default function EditStudentProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      socialMedia: [],
      achievements: [],
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: "socialMedia" });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });

  useEffect(() => {
    if (!user?.id) return;
    studentApi
      .getById(user.id)
      .then((res) => {
        const s: Student = res.data.data;
        reset({
          name: s.name,
          contactNumber: s.contactNumber ?? "",
          gender: s.gender ?? "",
          bio: s.bio ?? "",
          skills: s.skills.join(", "),
          interests: s.interests.join(", "),
          profileImage: s.profileImage ?? "",
          cvLink: s.cvLink ?? "",
          portfolioLink: s.portfolioLink ?? "",
          socialMedia: s.socialMedia.map((sm) => ({
            platform: sm.platform,
            link: sm.link,
          })),
          achievements: s.achievements.map((a) => ({
            title: a.title,
            description: a.description ?? "",
            year: a.year,
          })),
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user?.id, reset]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await studentApi.updateMe({
        name: data.name,
        contactNumber: data.contactNumber || undefined,
        gender: data.gender || undefined,
        bio: data.bio || undefined,
        skills: data.skills
          ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        interests: data.interests
          ? data.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        profileImage: data.profileImage || undefined,
        cvLink: data.cvLink || undefined,
        portfolioLink: data.portfolioLink || undefined,
        socialMedia: data.socialMedia.filter((sm) => sm.platform && sm.link),
        achievements: data.achievements.filter((a) => a.title),
      });
      toast.success("Profile updated");
      navigate("/student/profile");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper maxWidth="md">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>
          <Input label="Full Name" {...register("name")} error={errors.name?.message} />
          <Input label="Contact Number" {...register("contactNumber")} error={errors.contactNumber?.message} />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              {...register("gender")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Details</h2>
          <Input
            label="Skills (comma separated)"
            {...register("skills")}
            placeholder="e.g. React, TypeScript, Node.js"
            error={errors.skills?.message}
          />
          <Input
            label="Interests (comma separated)"
            {...register("interests")}
            placeholder="e.g. AI, Web Dev, Cloud"
            error={errors.interests?.message}
          />
          <Input label="Profile Image URL" {...register("profileImage")} error={errors.profileImage?.message} />
          <Input label="CV Link" {...register("cvLink")} error={errors.cvLink?.message} />
          <Input label="Portfolio Link" {...register("portfolioLink")} error={errors.portfolioLink?.message} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendSocial({ platform: "", link: "" })}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          {socialFields.length === 0 && (
            <p className="text-sm text-gray-400">No social media links added.</p>
          )}
          {socialFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="w-1/3">
                <Input
                  label={index === 0 ? "Platform" : undefined}
                  {...register(`socialMedia.${index}.platform`)}
                  placeholder="e.g. LinkedIn"
                  error={errors.socialMedia?.[index]?.platform?.message}
                />
              </div>
              <div className="flex-1">
                <Input
                  label={index === 0 ? "Link" : undefined}
                  {...register(`socialMedia.${index}.link`)}
                  placeholder="https://..."
                  error={errors.socialMedia?.[index]?.link?.message}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSocial(index)}
                className="mb-0.5 rounded-lg p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendAchievement({ title: "", description: "", year: new Date().getFullYear() })}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          {achievementFields.length === 0 && (
            <p className="text-sm text-gray-400">No achievements added.</p>
          )}
          {achievementFields.map((field, index) => (
            <div key={field.id} className="space-y-2 rounded-lg border border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <Input
                  label={index === 0 ? "Title" : undefined}
                  {...register(`achievements.${index}.title`)}
                  placeholder="Achievement title"
                  error={errors.achievements?.[index]?.title?.message}
                />
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="ml-2 mb-0.5 rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Input
                label="Description (optional)"
                {...register(`achievements.${index}.description`)}
                placeholder="Brief description"
              />
              <Input
                label="Year"
                type="number"
                {...register(`achievements.${index}.year`)}
                error={errors.achievements?.[index]?.year?.message}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/student/profile")}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
