"use client";

import { Button, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import AbstractBackground from "@/components/AbstractBackground";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.oldPassword || !form.newPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.patch("/auth/change-password", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.success("Password changed successfully 🔐");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d17]">
      <AbstractBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-3xl bg-white/90 dark:bg-white/10 backdrop-blur-xl p-6 shadow-xl border border-white/20">
            <h1 className="text-2xl font-bold text-center mb-2">
              Change Password 🔒
            </h1>
            <p className="text-sm text-center text-gray-500 mb-6">
              Update your account password
            </p>

            <div className="space-y-4">
              <TextInput
                type="password"
                placeholder="Current password"
                sizing="lg"
                value={form.oldPassword}
                onChange={(e) =>
                  setForm({ ...form, oldPassword: e.target.value })
                }
              />

              <TextInput
                type="password"
                placeholder="New password"
                sizing="lg"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
            </div>

            <Button
              onClick={submit}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600"
              size="lg"
            >
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
