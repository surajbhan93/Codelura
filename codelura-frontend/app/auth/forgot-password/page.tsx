"use client";

import { Button, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import AbstractBackground from "@/components/AbstractBackground";
import { useTheme } from "next-themes";

export default function ForgotPassword() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email 📩");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0b0d17]">
      {/* SVG BACKGROUND */}
      <AbstractBackground />

      {/* THEME TOGGLE */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20
        text-xs sm:text-sm px-3 py-1 rounded-full
        bg-black/10 dark:bg-white/10 backdrop-blur-md"
      >
        {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
      </button>

      {/* CONTENT */}
      <div
        className="
          relative z-10
          flex min-h-screen items-center justify-center
          px-4 sm:px-6 lg:px-8
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="w-full max-w-md sm:max-w-lg"
        >
          {/* GLASS CARD */}
          <div
            className="
              rounded-3xl
              p-6 sm:p-8
              bg-white/80 dark:bg-white/10
              backdrop-blur-xl
              border border-white/20
              shadow-[0_0_80px_rgba(99,102,241,0.25)]
              text-center
            "
          >
            {/* BRAND */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white mb-2">
              Codelura<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
              Enter your email to receive a password reset link
            </p>

            {/* FORM */}
            <div className="space-y-4">
              <TextInput
                type="email"
                placeholder="Email address"
                sizing="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* CTA */}
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                onClick={submit}
                disabled={loading}
                size="lg"
                className="
                  mt-6 w-full
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700
                  transition-all shadow-lg
                "
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </motion.div>

            {/* FOOTER */}
            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-300">
              Remember your password?{" "}
              <a
                href="/auth/login"
                className="text-indigo-500 font-medium hover:underline"
              >
                Back to Login
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
