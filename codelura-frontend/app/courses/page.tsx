"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

type Course = {
  _id: string;
  title: string;
  price: number;
  isPaid: boolean;
  category: string;
  level?: string;
  language?: string;
  tags?: string[];
  rating?: number;
  bannerImage?: {
    filePath: string;
  };
};

const ITEMS_PER_PAGE = 6;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visibleCourses = courses.slice(start, start + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">

        {/* ================= HEADER ================= */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Courses & Notes
          </h1>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            High-quality notes & courses for exams, interviews and practice
          </p>
        </div>

        {courses.length === 0 && (
          <p className="text-center text-gray-500">
            No courses available yet.
          </p>
        )}

        {/* ================= GRID ================= */}
       <div className="
  grid grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  gap-6 sm:gap-8
">

          {visibleCourses.map((c) => (
            <motion.div
              key={c._id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur border border-gray-100
                         rounded-2xl overflow-hidden shadow-md hover:shadow-2xl"
            >
              {/* IMAGE */}
              <div className="relative h-56 sm:h-48 bg-gray-100">
                {c.bannerImage?.filePath ? (
                  <img
                    src={`http://localhost:3000/${c.bannerImage.filePath}`}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                {/* PRICE */}
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow
                    ${
                      c.isPaid
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                >
                  {c.isPaid ? `₹${c.price}` : "FREE"}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3">
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {c.title}
                </h2>

                {/* META */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  {c.level && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {c.level}
                    </span>
                  )}
                </div>

                {c.language && (
                  <p className="text-xs text-gray-500">
                    Language: {c.language}
                  </p>
                )}

                {c.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {typeof c.rating === "number" && (
                  <p className="text-xs text-yellow-600">
                    ⭐ {c.rating.toFixed(1)} rating
                  </p>
                )}

                <Link
                  href={`/courses/${c._id}`}
                  className="block mt-4 text-center rounded-xl
    py-3 sm:py-2.5
    text-base sm:text-sm
    font-semibold
    bg-gradient-to-r from-indigo-600 to-purple-600
    hover:from-indigo-700 hover:to-purple-700
    text-white transition"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-14">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition
                  ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-gray-600 hover:bg-indigo-50"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
