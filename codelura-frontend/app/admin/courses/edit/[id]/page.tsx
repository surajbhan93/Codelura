"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) =>
      setCourse(res.data.course)
    );
  }, [id]);

  const update = async () => {
    const fd = new FormData();
    Object.entries(course).forEach(([k, v]) => {
      if (typeof v === "string" || typeof v === "number")
        fd.append(k, String(v));
    });

    if (pdf) fd.append("pdf", pdf);
    if (banner) fd.append("banner", banner);

    try {
      await api.put(`/admin/courses/${id}`, fd);
      toast.success("Updated");
      router.push("/admin/courses");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Edit Course</h1>

      <input
        value={course.title}
        className="input"
        onChange={(e) =>
          setCourse({ ...course, title: e.target.value })
        }
      />

      <textarea
        value={course.description}
        className="input"
        onChange={(e) =>
          setCourse({
            ...course,
            description: e.target.value
          })
        }
      />

      <input
        type="number"
        value={course.price}
        className="input"
        onChange={(e) =>
          setCourse({
            ...course,
            price: Number(e.target.value)
          })
        }
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setPdf(e.target.files?.[0] || null)
        }
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setBanner(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={update}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Course
      </button>
    </div>
  );
}
