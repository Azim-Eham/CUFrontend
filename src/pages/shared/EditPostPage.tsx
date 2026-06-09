import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { postApi } from "@/api/post.api";
import { useAuthStore } from "@/stores/authStore";
import { POST_TYPES, MEDIA_TYPES, POST_TYPE_LABELS } from "@/utils/constants";
import PageWrapper from "@/components/layout/PageWrapper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

const mediaTypeOptions = MEDIA_TYPES.map((m) => ({
  value: m,
  label: m.charAt(0).toUpperCase() + m.slice(1),
}));

const postTypeOptions = POST_TYPES.map((t) => ({
  value: t,
  label: POST_TYPE_LABELS[t] || t,
}));

const schema = z.object({
  type: z.string().min(1, "Post type is required"),
  title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  tags: z.string().optional(),
  media: z.array(
    z.object({
      mediaType: z.string().min(1, "Media type is required"),
      url: z.string().url("Must be a valid URL").or(z.literal("")),
      caption: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export default function EditPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
      tags: "",
      media: [],
    },
  });

  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({ control, name: "media" });

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    postApi.getById(postId)
      .then((res) => {
        const post = res.data.data;
        const author = typeof post.author === "object" ? post.author : null;
        const authorEmail = author?.email || "";

        // Enforce ownership checking
        if (user && authorEmail && authorEmail !== user.email) {
          toast.error("You are not authorized to edit this post");
          navigate("/");
          return;
        }

        reset({
          type: post.type || "",
          title: post.title || "",
          description: post.description || "",
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
          media: Array.isArray(post.media)
            ? post.media.map((m: any) => ({
                mediaType: m.mediaType || "",
                url: m.url || "",
                caption: m.caption || "",
              }))
            : [],
        });
      })
      .catch(() => {
        toast.error("Failed to load post details");
        navigate(-1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId, reset, user, navigate]);

  const onSubmit = async (data: FormValues) => {
    if (!postId) return;
    setSubmitting(true);
    try {
      await postApi.update(postId, {
        type: data.type as any,
        title: data.title || undefined,
        description: data.description,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        media: data.media
          .filter((m) => m.url && m.mediaType)
          .map((m) => ({
            mediaType: m.mediaType as any,
            url: m.url,
            caption: m.caption || undefined,
          })),
      });
      toast.success("Post updated successfully");
      navigate(`/posts/${postId}`);
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper maxWidth="md">
        <div className="flex justify-center py-24">
          <LoadingSpinner />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="md" className="page-enter">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <Select
            label="Post Type"
            options={postTypeOptions}
            placeholder="Select a type"
            {...register("type")}
            error={errors.type?.message}
          />
          <Input
            label="Title (optional)"
            {...register("title")}
            placeholder="Give your post a title"
            error={errors.title?.message}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400"
              placeholder="Write your post content..."
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>Min. 1 character</span>
              <span>{(watch("description") || "").length} characters</span>
            </div>
            {errors.description?.message && (
              <p className="mt-1 text-xs text-red-650">{errors.description.message}</p>
            )}
          </div>
          <Input
            label="Tags (comma separated)"
            {...register("tags")}
            placeholder="e.g. react, tutorial, web"
            error={errors.tags?.message}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Media</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendMedia({ mediaType: "", url: "", caption: "" })}
            >
              <Plus className="h-4 w-4" /> Add Media
            </Button>
          </div>
          {mediaFields.length === 0 && (
            <p className="text-sm text-gray-450">No media attached.</p>
          )}
          {mediaFields.map((field, index) => (
            <div key={field.id} className="space-y-2 rounded-lg border border-gray-100 p-3 bg-gray-50/50">
              <div className="flex items-center justify-between gap-2">
                <div className="w-1/3">
                  <Select
                    label={index === 0 ? "Type" : undefined}
                    options={mediaTypeOptions}
                    placeholder="Select type"
                    {...register(`media.${index}.mediaType`)}
                    error={errors.media?.[index]?.mediaType?.message}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={index === 0 ? "URL" : undefined}
                    {...register(`media.${index}.url`)}
                    placeholder="https://..."
                    error={errors.media?.[index]?.url?.message}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="mb-0.5 rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Input
                label="Caption (optional)"
                {...register(`media.${index}.caption`)}
                placeholder="Add a caption"
              />
              {/* Media Preview Card */}
              {watch(`media.${index}.url`) && (
                <div className="mt-2 border border-gray-200 rounded-lg p-2.5 bg-white flex items-center gap-3 shadow-sm">
                  {watch(`media.${index}.mediaType`) === "image" ? (
                    <img
                      src={watch(`media.${index}.url`)}
                      alt="Preview"
                      className="h-12 w-12 rounded object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : watch(`media.${index}.mediaType`) === "video" ? (
                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-200">
                      Video
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-200">
                      Link
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-700 truncate">{watch(`media.${index}.url`)}</p>
                    {watch(`media.${index}.caption`) && (
                      <p className="text-xs text-gray-400 truncate">{watch(`media.${index}.caption`)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
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
