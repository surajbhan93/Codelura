"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import {
  TextInput,
  Textarea,
  Button,
  ToggleSwitch,
  Card,
  Badge
} from "flowbite-react";
import { motion } from "framer-motion";
// import RichTextEditor from "@/components/admin/RichTextEditor";

export default function AdminBlogForm({
  initialData = {},
  isEdit = false,
  blogId
}: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    ogImage: "",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    category: "",
    authorName: "",
    readingTime: "",
    isFeatured: false,
    allowComments: true,
    publishNow: false,
    ...initialData
  });
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false
});
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        tags: form.tags
          ?.split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      };

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      };

      if (isEdit) {
        await api.patch(`/admin/blogs/${blogId}`, payload, { headers });
        toast.success("Blog updated successfully ✅");
      } else {
        await api.post("/admin/blogs", payload, { headers });
        toast.success("Blog created successfully 🚀");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen 
    bg-gradient-to-br from-slate-900 via-indigo-950 to-black
    px-4 sm:px-6 lg:px-8 py-8"
    >

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
    {isEdit ? "Edit Blog" : "Create New Blog"}
  </h1>

  <Badge color="indigo" size="lg">
    {isEdit ? "Editing" : "Draft"}
  </Badge>
</div>


      {/* BASIC INFO */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">📌 Basic Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Blog Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Custom Slug (optional)"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
          />
        </div>

        <Textarea
        
          className="focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Short excerpt (used in previews & SEO)"
          value={form.excerpt}
          onChange={(e) =>
            setForm({ ...form, excerpt: e.target.value })
          }
        />
      </Card>

      {/* CONTENT */}
<Card className="bg-white/90 backdrop-blur-xl border border-white/10 shadow-xl">
  <h2 className="text-lg font-semibold text-slate-800 mb-4">
    📝 Blog Content
  </h2>

  <Textarea
    rows={14}
    placeholder="Write blog content (HTML supported)"
    value={form.content}
    onChange={(e) =>
      setForm({ ...form, content: e.target.value })
    }
    className="focus:ring-2 focus:ring-indigo-500"
  />

  {/* LIVE PREVIEW */}
  {form.content && (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Preview</h3>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: form.content }}
      />
    </div>
  )}
</Card>




      {/* MEDIA */}
      <Card className="bg-black/180 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-600 mb-4">🖼 Media</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Cover Image URL"
            value={form.coverImage}
            onChange={(e) =>
              setForm({ ...form, coverImage: e.target.value })
            }
          />

          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="OG Image URL"
            value={form.ogImage}
            onChange={(e) =>
              setForm({ ...form, ogImage: e.target.value })
            }
          />
        </div>
      </Card>

      {/* SEO */}
      <Card className="bg-black/180 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-600 mb-4">🔍 SEO Metadata</h2>

        <TextInput
        className="focus:ring-2 focus:ring-indigo-500"
          placeholder="Meta Title"
          value={form.metaTitle}
          onChange={(e) =>
            setForm({ ...form, metaTitle: e.target.value })
          }
        />

        <Textarea
          className="focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={(e) =>
            setForm({
              ...form,
              metaDescription: e.target.value
            })
          }
        />
      </Card>

      {/* ATTRIBUTES */}
      <Card className="bg-black/180 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-600 mb-4">🏷 Attributes</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value })
            }
          />

          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Author Name"
            value={form.authorName}
            onChange={(e) =>
              setForm({ ...form, authorName: e.target.value })
            }
          />

          <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Reading Time (e.g. 8 min read)"
            value={form.readingTime}
            onChange={(e) =>
              setForm({ ...form, readingTime: e.target.value })
            }
          />
        </div>
      </Card>

      {/* SETTINGS */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="font-semibold mb-4">⚙️ Settings</h2>

        <div className="space-y-3">
          <ToggleSwitch
            checked={form.isFeatured}
            label="Featured Blog"
            onChange={(v) =>
              setForm({ ...form, isFeatured: v })
            }
          />

          <ToggleSwitch
            checked={form.allowComments}
            label="Allow Comments"
            onChange={(v) =>
              setForm({ ...form, allowComments: v })
            }
          />

          <ToggleSwitch
            checked={form.publishNow}
            label="Publish Immediately"
            onChange={(v) =>
              setForm({ ...form, publishNow: v })
            }
          />
        </div>
      </Card>

      {/* ACTION BAR */}
      <div className="sticky bottom-0 z-50
  bg-white/80 backdrop-blur-lg
  border-t border-slate-200
  px-4 py-3
  flex flex-col sm:flex-row
  justify-end gap-3">
        <Button color="gray">Cancel</Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600"
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Blog"
            : "Create Blog"}
        </Button>
      </div>
    </motion.div>
  );
}
