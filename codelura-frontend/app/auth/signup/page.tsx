"use client";

import { Button, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "@/lib/api";
import AbstractBackground from "@/components/AbstractBackground";
import PasswordStrength from "@/components/PasswordStrength";
import { useTheme } from "next-themes";

export default function SignupPage() {
  const { theme, setTheme } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
const submit = async () => {
  if (!form.name || !form.email || !form.password) {
    toast.error("All fields required");
    return;
  }

  try {
    await api.post("/auth/signup", {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    toast.success("Account created 🎉 Check your email to verify");
window.location.href = "/auth/check-email";

    // window.location.href = "/auth/login";
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0b0d17]">
      <AbstractBackground />

      {/* THEME TOGGLE */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 z-20 text-xs sm:text-sm px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur"
      >
        {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="rounded-3xl bg-white/90 dark:bg-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            {/* HEADER */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-1">
              Codelura<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-6">
              Build • Learn • Ship faster
            </p>

            {/* GOOGLE LOGIN */}
            <div className="w-full">
              <GoogleLogin
                onSuccess={async (res) => {
                  await api.post("/auth/google", { token: res.credential });
                  toast.success("Signed in with Google 🚀");
                }}
                onError={() => toast.error("Google signup failed")}
                width="100%"
              />
            </div>

            {/* DIVIDER */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300 dark:bg-white/20" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-white/20" />
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <TextInput
                placeholder="Full Name"
                sizing="lg"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <TextInput
                type="email"
                placeholder="Email address"
                sizing="lg"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <TextInput
                type="password"
                placeholder="Password"
                sizing="lg"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <PasswordStrength password={form.password} />
            </div>

            {/* BUTTON */}
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
              onClick={submit}
                className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                size="lg"
              >
                Create Account
              </Button>
            </motion.div>

            {/* FOOTER */}
            <p className="mt-5 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
              Already part of Codelura?{" "}
              <a
                href="/auth/login"
                className="text-indigo-500 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
