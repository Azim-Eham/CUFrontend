import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { postApi } from "@/api/post.api";
import { POST_TYPES, POST_TYPE_LABELS, MEDIA_TYPES } from "@/utils/constants";
import PageWrapper from "@/components/layout/PageWrapper";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const postSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  tags: z.string().optional(),
  media: z.array(
    z.object({
      mediaType: z.string().min(1, "Type is required"),
      url: z.string().url("Invalid URL").min(1, "URL is required"),
      caption: z.string().optional(),
    })
  ),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePost() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
      tags: "",
      media: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "media" });

  const onSubmit = async (data: PostFormData) => {
    setSubmitting(true);
    try {
      await postApi.create({
        type: data.type as any,
        title: data.title || undefined,
        description: data.description,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        media: data.media.length > 0 ? (data.media as any) : undefined,
      });
      toast.success("Post created successfully");
      navigate("/alumni");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = POST_TYPES.map((t) => ({
    value: t,
    label: POST_TYPE_LABELS[t],
  }));

  const mediaTypeOptions = MEDIA_TYPES.map((m) => ({
    value: m,
    label: m.charAt(0).toUpperCase() + m.slice(1),
  }));

  return (
    <PageWrapper maxWidth="md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Select
              label="Type"
              options={typeOptions}
              placeholder="Select post type"
              {...register("type")}
              error={errors.type?.message}
            />
            <Input
              label="Title (optional)"
              placeholder="Enter a title for your post"
              {...register("title")}
              error={errors.title?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={5}
                placeholder="Write your post content..."
                {...register("description")}
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>Min. 1 character</span>
                <span>{(watch("description") || "").length} characters</span>
              </div>
              {errors.description?.message && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
            <Input
              label="Tags (comma-separated)"
              placeholder="e.g. react, javascript, tutorial"
              {...register("tags")}
              error={errors.tags?.message}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex gap-2">
                  <Select
                    options={mediaTypeOptions}
                    placeholder="Type"
                    {...register(`media.${index}.mediaType`)}
                    error={errors.media?.[index]?.mediaType?.message}
                    className="w-32"
                  />
                  <Input
                    placeholder="URL"
                    {...register(`media.${index}.url`)}
                    error={errors.media?.[index]?.url?.message}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Caption (optional)"
                    {...register(`media.${index}.caption`)}
                    className="w-40"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                {/* Media Preview Card */}
                {watch(`media.${index}.url`) && (
                  <div className="mt-2 border border-gray-200 rounded-lg p-2.5 bg-gray-50 flex items-center gap-3 shadow-sm">
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
                      <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-205">
                        Video
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-205">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ mediaType: "", url: "", caption: "" })}
            >
              <Plus className="h-4 w-4" />
              Add Media
            </Button>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/alumni")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create Post
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
