"use client";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function BlogActions({ blog }: any) {
  const likeBlog = async () => {
    const res = await api.post(
      `/blogs/${blog._id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    toast.success(`Likes: ${res.data.likesCount}`);
  };

  return (
    <div className="flex gap-4 mt-6">
      <button onClick={likeBlog}>👍 Like</button>
      <button>🔗 Share</button>
    </div>
  );
}
