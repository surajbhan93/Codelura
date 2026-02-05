"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import PaymentIcons from "@/components/shared/PaymentIcons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ExternalLink = {
  title: string;
  url: string;
  type: string;
};
export default function CourseDetailPage() {
  const { id } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const FREE_PAGES = course?.previewPages || 2;

 /* ================= FETCH COURSE ================= */
  useEffect(() => {
  if (!course?._id) return;

  fetch(
    `http://localhost:3000/api/courses/${course._id}/preview`,
    { method: "HEAD" }
  )
    .then((res) => {
      const total = res.headers.get("x-total-pages");
      if (total) setTotalPages(Number(total));
    })
    .catch(() => {});
}, [course]);


  useEffect(() => {
    if (!id) return;

    api
      .get(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data.course);
        setCanAccess(res.data.canAccess);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= STICKY CTA ================= */
  useEffect(() => {
    const onScroll = () => {
      const preview = document.getElementById("preview");
      if (!preview) return;
      setShowSticky(preview.getBoundingClientRect().bottom < 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!course) return <p className="p-10 text-center">Course not found</p>;

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="max-w-[1400px] mx-auto px-4 py-8">

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ================= LEFT (CONTENT) ================= */}
          <motion.div
            className="lg:col-span-3 space-y-6 bg-white/70 backdrop-blur
             rounded-2xl p-6 md:p-8
             shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold">{course.title}</h1>
             <Badge variant="secondary">
                {course.isPaid ? `₹${course.price}` : "Free"}
              </Badge>

            <div className="flex flex-wrap gap-2">
              <Badge>{course.category}</Badge>
              <Badge>{course.language}</Badge>
              <Badge>{course.level}</Badge>
            </div>
            

            {/* DESCRIPTION */}
                {/* DESCRIPTION */}
        {course.description && (
  <Card className="border border-slate-200 shadow-sm rounded-2xl">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl font-semibold flex items-center gap-2">
        📘 Course Description
      </CardTitle>
      <p className="text-sm text-gray-500">
        Overview of what this material covers
      </p>
    </CardHeader>

    <CardContent className="prose prose-slate max-w-none
                            text-gray-700 leading-relaxed">
      {/* MAIN DESCRIPTION */}
      <p>
        {course.description}
      </p>

      {/* OPTIONAL STRUCTURED INFO (auto visible if data exists) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {course.level && (
          <div className="bg-slate-50 border rounded-lg p-3">
            <p className="font-medium text-gray-800">📚 Level</p>
            <p className="text-gray-600 capitalize">{course.level}</p>
          </div>
        )}

        {course.language && (
          <div className="bg-slate-50 border rounded-lg p-3">
            <p className="font-medium text-gray-800">🗣 Language</p>
            <p className="text-gray-600">{course.language}</p>
          </div>
        )}

        {course.duration && (
          <div className="bg-slate-50 border rounded-lg p-3">
            <p className="font-medium text-gray-800">⏱ Duration</p>
            <p className="text-gray-600">{course.duration}</p>
          </div>
        )}

        {totalPages && (
          <div className="bg-slate-50 border rounded-lg p-3">
            <p className="font-medium text-gray-800">📄 Pages</p>
            <p className="text-gray-600">{totalPages} pages</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}


 {/* PDF PREVIEW */}
        

<CardContent className="space-y-3">
  {/* ITEM 1 */}
  <div className="flex items-start gap-3 p-4 rounded-xl
                  bg-white shadow-sm border
                  hover:shadow-md transition">
    <span className="text-green-600 text-lg">📄</span>
    <div>
      <p className="font-medium text-gray-800">
        {totalPages} Pages of Notes
      </p>
      <p className="text-xs text-gray-500">
        Well-structured & exam-focused
      </p>
    </div>
  </div>

  {/* ITEM 2 */}
  <div className="flex items-start gap-3 p-4 rounded-xl
                  bg-white shadow-sm border
                  hover:shadow-md transition">
    <span className="text-indigo-600 text-lg">🎓</span>
    <div>
      <p className="font-medium text-gray-800">
        Exam & Interview Ready
      </p>
      <p className="text-xs text-gray-500">
        Important concepts & questions
      </p>
    </div>
  </div>

  {/* ITEM 3 */}
  <div className="flex items-start gap-3 p-4 rounded-xl
                  bg-white shadow-sm border
                  hover:shadow-md transition">
    <span className="text-purple-600 text-lg">🖨️</span>
    <div>
      <p className="font-medium text-gray-800">
        Printable PDF
      </p>
      <p className="text-xs text-gray-500">
        Download & print anytime
      </p>
    </div>
  </div>

  {/* ITEM 4 */}
  <div className="flex items-start gap-3 p-4 rounded-xl
                  bg-white shadow-sm border
                  hover:shadow-md transition">
    <span className="text-orange-500 text-lg">🔄</span>
    <div>
      <p className="font-medium text-gray-800">
        Free Future Updates
      </p>
      <p className="text-xs text-gray-500">
        Updated content included
      </p>
    </div>
  </div>
</CardContent>


   
            {/* SHARE (SCRIBD STYLE) */}
            <Card className="border border-slate-200 rounded-xl shadow-sm">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-gray-700">
      Share this document
    </CardTitle>
  </CardHeader>

  <CardContent className="flex items-center gap-3">
    {/* Copy Link */}
    <Button
      size="icon"
      variant="outline"
      className="rounded-full hover:bg-slate-100"
      title="Copy link"
    >
      🔗
    </Button>

    {/* Facebook */}
    <Button
      size="icon"
      variant="outline"
      className="rounded-full hover:bg-blue-50"
      title="Share on Facebook"
    >
      📘
    </Button>

    {/* Twitter / X */}
    <Button
      size="icon"
      variant="outline"
      className="rounded-full hover:bg-sky-50"
      title="Share on Twitter"
    >
      🐦
    </Button>

    {/* WhatsApp */}
    <Button
      size="icon"
      variant="outline"
      className="rounded-full hover:bg-green-50"
      title="Share on WhatsApp"
    >
      💬
    </Button>
  </CardContent>
</Card>

          </motion.div>

        
     {/* ================= CENTER (PDF PREVIEW) ================= */}
          <div className="lg:col-span-6">

  {/* PDF PREVIEW */}
  <Card
    id="preview"
    className="border-2 border-indigo-100
               shadow-lg rounded-2xl
               bg-white"
  >
    {/* HEADER */}
    <CardHeader>
      <CardTitle className="text-base font-semibold">
        Free Preview ({FREE_PAGES} / {totalPages ?? "…"} pages)
      </CardTitle>
    </CardHeader>
 

    {/* PDF VIEWER */}
    <CardContent className="relative overflow-hidden">
      <iframe
        src={`http://localhost:3000/api/courses/${course._id}/preview`}
        className="w-full h-[75vh] rounded-xl border"
      />

      {/* LOCK OVERLAY */}
      {!canAccess && (
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{ top: "420px" }}
        >
          <div className="h-full bg-white/70 backdrop-blur-md" />

          <div className="absolute inset-0 flex flex-col
                          items-center justify-center
                          text-center px-6">
            <p className="text-lg font-semibold mb-2">
              🔒 Remaining pages are locked
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Purchase to unlock full content
            </p>

            <Button
              className="bg-indigo-600"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Unlock for ₹{course.price}
            </Button>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</div>


          {/* ATTACHMENTS */}
          {course.attachments?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-5 text-gray-700">
                  {course.attachments.map((f: any, i: number) => (
                    <li key={i}>{f.fileName}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

{/* EXTERNAL LINKS */}
          {course.externalLinks?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Extra Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.externalLinks.map(
                  (link: ExternalLink, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      className="block text-indigo-600 font-medium hover:underline"
                    >
                      🔗 {link.title}
                    </a>
                  )
                )}
              </CardContent>
            </Card>
          )}



          {/* ================= RIGHT (PRICING + RELATED) ================= */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 h-fit">

            {/* PRICING */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle>Course Price</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-4xl font-bold">
                  {course.isPaid ? `₹${course.price}` : "Free"}
                </p>

                {canAccess ? (
                  <Button asChild className="w-full bg-green-500">
                    <a
                      href={`http://localhost:3000/api/courses/${course._id}/pdf`}
                      target="_blank"
                    >
                      Download Full PDF
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full bg-white text-indigo-600">
                    Buy & Unlock
                  </Button>
                )}

                <p className="text-xs text-indigo-200 text-center">
                  🔒 Secure one-time payment
                </p>
              </CardContent>
            </Card>

            <PaymentIcons />

         {/* ================= EXTRA INFO CARD ================= */}
  <Card className="border shadow-sm">
    <CardContent className="text-sm text-gray-600 space-y-2 py-5">
      <p>📚 Suitable for: {course.level} learners</p>
      <p>🗣 Language: {course.language}</p>
      {course.duration && <p>⏱ Duration: {course.duration}</p>}
      <p>📂 Category: {course.category}</p>
    </CardContent>
  </Card>


            {/* RELATED MATERIAL */}
           
 {/* MOBILE STICKY */}
      {!canAccess && showSticky && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
          <div className="bg-white border-t shadow-xl px-4 py-3 flex justify-between">
            <p className="font-semibold">₹{course.price}</p>
            <Button className="bg-indigo-600">Buy Now</Button>
          </div>
        </div>
      )}

          </div>
        </div>
      </div>
    </div>
  );
}
