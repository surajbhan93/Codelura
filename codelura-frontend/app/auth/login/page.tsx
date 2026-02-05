"use client";

import { Button, TextInput, Checkbox, Label } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import AbstractBackground from "@/components/AbstractBackground";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false
  });

 const submit = async () => {
  if (!form.email || !form.password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const res = await api.post(
      "/auth/login",
      {
        email: form.email,
        password: form.password
      }
    );

    const { user } = res.data;

    // 🔥 ROLE STORE KARO (navbar ke liye)
    localStorage.setItem("role", user.role);

    toast.success("Welcome back to Codelura 🚀");

    // 🔥 ROLE BASED REDIRECT
    if (user.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }

  } catch (err: any) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0b0d17]">
      <AbstractBackground />

      {/* THEME TOGGLE */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 z-20 text-xs sm:text-sm px-3 py-1 rounded-full 
        bg-black/10 dark:bg-white/10 backdrop-blur-md"
      >
        {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
      </button>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          {/* GLASS CARD */}
          <div className="rounded-3xl bg-white/90 dark:bg-white/10 backdrop-blur-xl 
            p-6 sm:p-8 shadow-[0_0_80px_rgba(99,102,241,0.25)] 
            border border-white/20">

            {/* BRAND */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white">
                Codelura<span className="text-indigo-500">.</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                Welcome back. Let’s continue building.
              </p>
            </div>

            {/* GOOGLE LOGIN */}
            <div className="mb-4">
              <GoogleLogin
                onSuccess={async (res) => {
                  await api.post("/auth/google", {
                    token: res.credential
                  });
                  toast.success("Logged in with Google 🚀");
                }}
                onError={() => toast.error("Google login failed")}
                width="100%"
              />
            </div>

            {/* DIVIDER */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300 dark:bg-white/20" />
              <span className="text-xs text-gray-500 dark:text-gray-300">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-white/20" />
            </div>

            {/* FORM */}
            <div className="space-y-4">
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
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                />
                <Label className="text-gray-600 dark:text-gray-300">
                  Remember me
                </Label>
              </div>

              <a
                href="/auth/forgot-password"
                className="text-indigo-500 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* CTA */}
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                onClick={submit}
                size="lg"
                className="mt-6 w-full bg-gradient-to-r 
                from-indigo-500 to-purple-600 
                hover:from-indigo-600 hover:to-purple-700 
                transition-all shadow-lg"
              >
                Login to Codelura
              </Button>
            </motion.div>

            {/* FOOTER */}
            <p className="mt-5 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
              New to Codelura?{" "}
              <a
                href="/auth/signup"
                className="text-indigo-500 font-medium hover:underline"
              >
                Create an account
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
