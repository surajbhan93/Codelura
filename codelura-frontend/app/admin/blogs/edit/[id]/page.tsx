import api from "@/lib/api";
import AdminBlogForm from "@/components/admin/AdminBlogForm";

export default async function EditBlogPage({ params }: any) {
  const { data } = await api.get(`/admin/blogs/${params.id}`, {
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
    }
  });

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold mb-4">Edit Blog</h1>
      <AdminBlogForm isEdit blogId={params.id} initialData={{
        ...data,
        tags: data.tags.join(", ")
      }} />
    </div>
  );
}
