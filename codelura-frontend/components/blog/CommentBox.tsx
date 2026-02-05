"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CommentBox({ blogId }: any) {
  const [comment, setComment] = useState("");

  const submit = async () => {
    await api.post(
      "/comments",
      { blogId, comment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    toast.success("Comment added");
    setComment("");
  };

  return (
    <div className="mt-8">
      <textarea
        className="w-full border rounded p-2"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submit} className="mt-2">
        Comment
      </button>
    </div>
  );
}
