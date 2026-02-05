// "use client";

// import { useState } from "react";
// import api from "@/lib/api";
// import toast from "react-hot-toast";

// export default function AdminCoursesPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState(0);
//   const [category, setCategory] = useState("notes");
//   const [pdf, setPdf] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     if (!title || !pdf) {
//       toast.error("Title and PDF required");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("price", String(price));
//     formData.append("category", category);
//     formData.append("pdf", pdf);

//     try {
//       setLoading(true);
//       await api.post("/admin/courses", formData);
//       toast.success("Course uploaded successfully 🚀");

//       setTitle("");
//       setDescription("");
//       setPrice(0);
//       setPdf(null);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Upload Course / Notes</h1>

//       <input
//         placeholder="Title"
//         className="input"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <textarea
//         placeholder="Description"
//         className="input mt-3"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Price (0 = Free)"
//         className="input mt-3"
//         value={price}
//         onChange={(e) => setPrice(Number(e.target.value))}
//       />

//       <select
//         className="input mt-3"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//       >
//         <option value="notes">Notes</option>
//         <option value="course">Course</option>
//       </select>

//       <input
//         type="file"
//         accept="application/pdf"
//         className="mt-3"
//         onChange={(e) => setPdf(e.target.files?.[0] || null)}
//       />

//       <button
//         onClick={submit}
//         disabled={loading}
//         className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Uploading..." : "Upload PDF"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  const loadCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Delete this course?")) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success("Course deleted");
      loadCourses();
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link
          href="/admin/courses/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Course
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th>Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.title}</td>
              <td>₹{c.price}</td>
              <td>{c.category}</td>
              <td className="space-x-3">
                <Link
                  href={`/admin/courses/edit/${c._id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteCourse(c._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
