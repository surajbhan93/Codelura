
// (Dashboard logic)

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, Badge, Spinner } from "flowbite-react";
import { motion } from "framer-motion";
import { Flame, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/blogs/popular")
      .then((res) => setBlogs(res.data))
      .catch((err) =>
        console.error("ADMIN DASHBOARD ERROR 👉", err)
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
          <Flame className="text-orange-500" />
          Popular Blogs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Top performing blogs based on engagement score
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Spinner size="xl" />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <FileText className="mx-auto mb-3" />
          No popular blogs found
        </div>
      )}

      {/* BLOG LIST */}
      {!loading && blogs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full shadow-md hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-2">
                  <Badge color="indigo">Popular</Badge>
                  <span className="text-xs text-gray-400">
                    #{i + 1}
                  </span>
                </div>

                <p className="text-sm font-semibold break-all">
                  Blog ID
                </p>
                <p className="text-xs text-gray-500 break-all mb-4">
                  {b._id}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Engagement Score
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {b.score}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
