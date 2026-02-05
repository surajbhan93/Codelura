import api from "@/lib/api";
import BlogCard from "@/components/blog/BlogCard";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  readingTime: string;
  tags: string[];
  isFeatured: boolean;
}

export default async function BlogsPage() {
  // Backend API: GET /api/blogs
  const { data } = await api.get("/blogs");

  const blogs: Blog[] = data.blogs || [];

  const featuredBlogs = blogs.filter((b) => b.isFeatured);
  const normalBlogs = blogs.filter((b) => !b.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold">
          Blogs <span className="text-indigo-600">.</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Learn backend, frontend & system design with real-world examples
        </p>
      </div>

      {/* FEATURED BLOGS */}
      {featuredBlogs.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">🌟 Featured</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} featured />
            ))}
          </div>
        </>
      )}

      {/* ALL BLOGS */}
      <h2 className="text-2xl font-bold mb-4">All Blogs</h2>
      {normalBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {normalBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
