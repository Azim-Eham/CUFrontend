import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { alumniApi } from "@/api/alumni.api";
import { ALUMNI_CATEGORIES, SOCIAL_PLATFORMS, Genders } from "@/utils/constants";
import type { Alumni } from "@/types/alumni.types";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const alumniSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.string().optional(),
  contactNumber: z.string().optional(),
  willingToMentor: z.boolean(),
  bio: z.string().optional(),
  portfolioLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
  }),
  onlinePresence: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required"),
      link: z.string().url("Invalid URL").min(1, "Link is required"),
    })
  ),
  achievements: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      year: z.coerce.number().min(1900, "Invalid year"),
    })
  ),
  alumniCategory: z.string().min(1, "Category is required"),
});

type AlumniFormData = z.infer<typeof alumniSchema>;

export default function EditAlumniProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AlumniFormData>({
    resolver: zodResolver(alumniSchema) as any,
    defaultValues: {
      name: "",
      gender: "",
      contactNumber: "",
      willingToMentor: false,
      bio: "",
      portfolioLink: "",
      location: { country: "", city: "" },
      onlinePresence: [],
      achievements: [],
      alumniCategory: "",
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: "onlinePresence" });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await alumniApi.getMe();
        const alumni: Alumni = res.data.data;
        reset({
          name: alumni.name,
          gender: alumni.gender || "",
          contactNumber: alumni.contactNumber || "",
          willingToMentor: alumni.willingToMentor,
          bio: alumni.bio || "",
          portfolioLink: alumni.portfolioLink || "",
          location: {
            country: alumni.location?.country || "",
            city: alumni.location?.city || "",
          },
          onlinePresence: alumni.onlinePresence || [],
          achievements: alumni.achievements || [],
          alumniCategory: alumni.alumniProfile?.alumniCategory || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: AlumniFormData) => {
    setSubmitting(true);
    try {
      await alumniApi.updateMe({
        name: data.name,
        gender: data.gender,
        contactNumber: data.contactNumber,
        willingToMentor: data.willingToMentor,
        bio: data.bio,
        portfolioLink: data.portfolioLink || undefined,
        location: {
          country: data.location.country || "",
          city: data.location.city || "",
        },
        onlinePresence: data.onlinePresence,
        achievements: data.achievements.map((a) => ({
          ...a,
          description: a.description || undefined,
        })),
        alumniProfile: {
          alumniCategory: data.alumniCategory,
        },
      });
      toast.success("Profile updated successfully");
      navigate("/alumni/profile");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageWrapper>
    );
  }

  const genderOptions = Genders.map((g) => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }));
  const categoryOptions = ALUMNI_CATEGORIES.map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1),
  }));
  const platformOptions = SOCIAL_PLATFORMS.map((p) => ({
    value: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
  }));

  return (
    <PageWrapper maxWidth="md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Select
              label="Gender"
              options={genderOptions}
              placeholder="Select gender"
              {...register("gender")}
              error={errors.gender?.message}
            />
            <Input
              label="Contact Number"
              {...register("contactNumber")}
              error={errors.contactNumber?.message}
            />
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register("willingToMentor")}
                />
                <span className="text-sm font-medium text-gray-700">
                  Available for mentorship
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={3}
                {...register("bio")}
              />
            </div>
            <Input
              label="Portfolio Link"
              placeholder="https://..."
              {...register("portfolioLink")}
              error={errors.portfolioLink?.message}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Country"
              {...register("location.country")}
              error={errors.location?.country?.message}
            />
            <Input
              label="City"
              {...register("location.city")}
              error={errors.location?.city?.message}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alumni Category</CardTitle>
          </CardHeader>
          <Select
            label="Category"
            options={categoryOptions}
            placeholder="Select category"
            {...register("alumniCategory")}
            error={errors.alumniCategory?.message}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Select
                  options={platformOptions}
                  placeholder="Platform"
                  {...register(`onlinePresence.${index}.platform`)}
                  error={errors.onlinePresence?.[index]?.platform?.message}
                  className="w-40"
                />
                <Input
                  placeholder="https://..."
                  {...register(`onlinePresence.${index}.link`)}
                  error={errors.onlinePresence?.[index]?.link?.message}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocial(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSocial({ platform: "", link: "" })}
            >
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {achievementFields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Title"
                    {...register(`achievements.${index}.title`)}
                    error={errors.achievements?.[index]?.title?.message}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Year"
                    type="number"
                    {...register(`achievements.${index}.year`)}
                    error={errors.achievements?.[index]?.year?.message}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <Input
                  placeholder="Description (optional)"
                  {...register(`achievements.${index}.description`)}
                  className="mt-2"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendAchievement({ title: "", description: "", year: new Date().getFullYear() })
              }
            >
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/alumni/profile")}
          >
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
