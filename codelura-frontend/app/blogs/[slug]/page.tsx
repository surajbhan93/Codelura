import api from "@/lib/api";

export async function generateMetadata({ params }: any) {
  const { data } = await api.get(`/blogs/${params.slug}`);
  return {
    title: data.metaTitle || data.title,
    description: data.metaDescription
  };
}

export default async function BlogDetail({ params }: any) {
  const { data: blog } = await api.get(`/blogs/${params.slug}`);

  return (
    <article className="max-w-3xl mx-auto p-6">
      <img src={blog.coverImage} className="rounded mb-4" />
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-gray-500">
        {blog.authorName} · {blog.readingTime}
      </p>

      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      <div className="mt-6 flex gap-2">
        {blog.tags.map((tag: string) => (
          <span key={tag} className="text-sm bg-gray-200 px-2 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
