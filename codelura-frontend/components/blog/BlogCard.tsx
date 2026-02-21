import Link from "next/link";

export default function BlogCard({
  blog,
  featured = false
}: {
  blog: any;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition
        ${featured ? "ring-2 ring-indigo-500" : ""}
      `}
    >
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        {featured && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
            FEATURED
          </span>
        )}

        <h2 className="font-bold text-lg mt-2 line-clamp-2">
          {blog.title}
        </h2>

        <p className="text-gray-500 text-sm mt-1 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="text-xs text-gray-400 mt-3">
          {blog.authorName} · {blog.readingTime}
        </div>

        <Link
          href={`/blogs/${blog.slug}`}
          className="text-indigo-600 text-sm font-medium mt-3 inline-block"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
