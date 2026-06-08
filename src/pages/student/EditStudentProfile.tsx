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
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
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

  // Temporary inputs for chip additions
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      skills: [],
      interests: [],
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
          skills: s.skills ?? [],
          interests: s.interests ?? [],
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

  const profileImageVal = watch("profileImage");

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("profileImage", reader.result as string);
        toast.success("Profile image loaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await studentApi.updateMe({
        name: data.name,
        contactNumber: data.contactNumber || undefined,
        gender: data.gender || undefined,
        bio: data.bio || undefined,
        skills: data.skills,
        interests: data.interests,
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
    <PageWrapper maxWidth="md" className="page-enter">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
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
          <h2 className="text-lg font-semibold text-gray-900">Avatar & Links</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary-500 bg-gray-200 flex items-center justify-center shadow-md">
              {profileImageVal ? (
                <img src={profileImageVal} alt="Profile Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs font-semibold">No Image</span>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <Input label="Profile Image URL" {...register("profileImage")} placeholder="https://..." error={errors.profileImage?.message} />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Or Upload Local Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Skills Tag Editor */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5 min-h-[42px] items-center">
              {watch("skills")?.length === 0 && (
                <span className="text-xs text-gray-400">No skills added yet.</span>
              )}
              {watch("skills")?.map((skill, index) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const cur = watch("skills") || [];
                      setValue("skills", cur.filter((_, i) => i !== index));
                    }}
                    className="text-primary-500 hover:text-primary-850 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = skillInput.trim();
                    if (val && !watch("skills")?.includes(val)) {
                      setValue("skills", [...(watch("skills") || []), val]);
                      setSkillInput("");
                    }
                  }
                }}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const val = skillInput.trim();
                  if (val && !watch("skills")?.includes(val)) {
                    setValue("skills", [...(watch("skills") || []), val]);
                    setSkillInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Interests Tag Editor */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
            <div className="flex flex-wrap gap-1.5 mb-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5 min-h-[42px] items-center">
              {watch("interests")?.length === 0 && (
                <span className="text-xs text-gray-400">No interests added yet.</span>
              )}
              {watch("interests")?.map((interest, index) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => {
                      const cur = watch("interests") || [];
                      setValue("interests", cur.filter((_, i) => i !== index));
                    }}
                    className="text-amber-600 hover:text-amber-850 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type an interest and press Enter"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = interestInput.trim();
                    if (val && !watch("interests")?.includes(val)) {
                      setValue("interests", [...(watch("interests") || []), val]);
                      setInterestInput("");
                    }
                  }
                }}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const val = interestInput.trim();
                  if (val && !watch("interests")?.includes(val)) {
                    setValue("interests", [...(watch("interests") || []), val]);
                    setInterestInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          <Input label="CV Link" {...register("cvLink")} placeholder="https://..." error={errors.cvLink?.message} />
          <Input label="Portfolio Link" {...register("portfolioLink")} placeholder="https://..." error={errors.portfolioLink?.message} />
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
            <div key={field.id} className="flex items-end gap-2 border border-gray-50 rounded-lg p-2.5">
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
