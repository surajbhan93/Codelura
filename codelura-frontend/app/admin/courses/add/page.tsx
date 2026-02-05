// // "use client";

// // import { useState } from "react";
// // import api from "@/lib/api";
// // import toast from "react-hot-toast";
// // import { useRouter } from "next/navigation";

// // export default function AddCoursePage() {
// //   const router = useRouter();

// //   const [form, setForm] = useState({
// //     title: "",
// //     description: "",
// //     price: 0,
// //     category: "notes",
// //     level: "beginner",
// //     language: "Hindi",
// //     tags: "",
// //     previewPages: 2
// //   });

// //   const [pdf, setPdf] = useState<File | null>(null);
// //   const [banner, setBanner] = useState<File | null>(null);
// //   const [loading, setLoading] = useState(false);

// //   const submit = async () => {
// //     if (!form.title || !pdf) {
// //       toast.error("Title & PDF required");
// //       return;
// //     }

// //     const fd = new FormData();
// //     Object.entries(form).forEach(([k, v]) =>
// //       fd.append(k, String(v))
// //     );
// //     fd.append("pdf", pdf);
// //     if (banner) fd.append("banner", banner);

// //     try {
// //       setLoading(true);
// //       await api.post("/admin/courses", fd);
// //       toast.success("Course created");
// //       router.push("/admin/courses");
// //     } catch {
// //       toast.error("Create failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-xl mx-auto p-6 space-y-3">
// //       <h1 className="text-2xl font-bold">Add Course</h1>

// //       <input
// //         placeholder="Title"
// //         className="input"
// //         onChange={(e) =>
// //           setForm({ ...form, title: e.target.value })
// //         }
// //       />

// //       <textarea
// //         placeholder="Description"
// //         className="input"
// //         onChange={(e) =>
// //           setForm({ ...form, description: e.target.value })
// //         }
// //       />

// //       <input
// //         type="number"
// //         placeholder="Price"
// //         className="input"
// //         onChange={(e) =>
// //           setForm({ ...form, price: Number(e.target.value) })
// //         }
// //       />

// //       <select
// //         className="input"
// //         onChange={(e) =>
// //           setForm({ ...form, category: e.target.value })
// //         }
// //       >
// //         <option value="notes">Notes</option>
// //         <option value="course">Course</option>
// //       </select>

// //       <input
// //         type="file"
// //         accept="application/pdf"
// //         onChange={(e) =>
// //           setPdf(e.target.files?.[0] || null)
// //         }
// //       />

// //       <input
// //         type="file"
// //         accept="image/*"
// //         onChange={(e) =>
// //           setBanner(e.target.files?.[0] || null)
// //         }
// //       />

// //       <button
// //         onClick={submit}
// //         disabled={loading}
// //         className="bg-indigo-600 text-white px-4 py-2 rounded"
// //       >
// //         {loading ? "Saving..." : "Create Course"}
// //       </button>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import api from "@/lib/api";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// export default function AddCoursePage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: 0,
//     category: "notes",
//     level: "beginner",
//     language: "Hindi",
//     tags: "",
//     previewPages: 2
//   });

//   const [pdf, setPdf] = useState<File | null>(null);
//   const [banner, setBanner] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     if (!form.title || !pdf) {
//       toast.error("Title & PDF required");
//       return;
//     }

//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) =>
//       fd.append(k, String(v))
//     );
//     fd.append("pdf", pdf);
//     if (banner) fd.append("banner", banner);

//     try {
//       setLoading(true);
//       await api.post("/admin/courses", fd);
//       toast.success("Course created");
//       router.push("/admin/courses");
//     } catch {
//       toast.error("Create failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 space-y-5">
        
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Add New Course
//         </h1>

//         {/* Title */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-600">
//             Course Title
//           </label>
//           <input
//             placeholder="Enter course title"
//             className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             onChange={(e) =>
//               setForm({ ...form, title: e.target.value })
//             }
//           />
//         </div>

//         {/* Description */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-600">
//             Description
//           </label>
//           <textarea
//             placeholder="Short course description"
//             rows={3}
//             className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//           />
//         </div>

//         {/* Price */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-600">
//             Price (₹)
//           </label>
//           <input
//             type="number"
//             placeholder="0"
//             className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             onChange={(e) =>
//               setForm({ ...form, price: Number(e.target.value) })
//             }
//           />
//         </div>

//         {/* Category */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-600">
//             Category
//           </label>
//           <select
//             className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             onChange={(e) =>
//               setForm({ ...form, category: e.target.value })
//             }
//           >
//             <option value="notes">notes</option>
//             <option value="course">Course</option>
//           </select>
//         </div>

//         {/* PDF */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-600">
//             Upload PDF
//           </label>
//           <input
//             type="file"
//             accept="application/pdf"
//             className="w-full text-sm"
//             onChange={(e) =>
//               setPdf(e.target.files?.[0] || null)
//             }
//           />
//         </div>

//         {/* Banner */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-600">
//             Banner Image (optional)
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             className="w-full text-sm"
//             onChange={(e) =>
//               setBanner(e.target.files?.[0] || null)
//             }
//           />
//         </div>

//         {/* Button */}
//         <button
//           onClick={submit}
//           disabled={loading}
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
//         >
//           {loading ? "Saving..." : "Create Course"}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "notes",
    level: "beginner",
    language: "Hindi",
    tags: "",
    previewPages: 2
  });

  const [pdf, setPdf] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     HANDLERS
  ----------------------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "previewPages"
          ? Number(value)
          : value
    }));
  };

  const submit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!pdf) {
      toast.error("PDF file is required");
      return;
    }

    if (form.previewPages < 1) {
      toast.error("Preview pages must be at least 1");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      fd.append(k, String(v))
    );
    fd.append("pdf", pdf);
    if (banner) fd.append("banner", banner);

    try {
      setLoading(true);
      await api.post("/admin/courses", fd);

      toast.success("Course created successfully 🚀");

      // reset
      setForm({
        title: "",
        description: "",
        price: 0,
        category: "notes",
        level: "beginner",
        language: "Hindi",
        tags: "",
        previewPages: 2
      });
      setPdf(null);
      setBanner(null);

      router.push("/admin/courses");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Create failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 space-y-5">
        <h1 className="text-2xl font-semibold text-gray-800">
          Add New Course / Notes
        </h1>

        {/* Title */}
        <Input
          label="Course Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter course title"
        />

        {/* Description */}
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short course description"
        />

        {/* Price */}
        <Input
          label="Price (₹)"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        {/* Preview Pages */}
        <Input
          label="Preview Pages"
          type="number"
          name="previewPages"
          value={form.previewPages}
          onChange={handleChange}
        />

        {/* Category */}
        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={[
            { value: "notes", label: "Notes" },
            { value: "course", label: "Course" }
          ]}
        />

        {/* Level */}
        <Select
          label="Level"
          name="level"
          value={form.level}
          onChange={handleChange}
          options={[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" }
          ]}
        />

        {/* Language */}
        <Input
          label="Language"
          name="language"
          value={form.language}
          onChange={handleChange}
        />

        {/* Tags */}
        <Input
          label="Tags (comma separated)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="maths,btech,semester"
        />

        {/* PDF */}
        <FileInput
          label="Upload PDF"
          accept="application/pdf"
          onChange={(e) =>
            setPdf(e.target.files?.[0] || null)
          }
        />

        {/* Banner */}
        <FileInput
          label="Banner Image (optional)"
          accept="image/*"
          onChange={(e) =>
            setBanner(e.target.files?.[0] || null)
          }
        />

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Course"}
        </button>
      </div>
    </div>
  );
}

/* =============================
   REUSABLE COMPONENTS
============================= */

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <select
        {...props}
        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type="file"
        {...props}
        className="w-full text-sm"
      />
    </div>
  );
}
