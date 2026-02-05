"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/api";
import AbstractBackground from "@/components/AbstractBackground";
import { useTheme } from "next-themes";
import { Button } from "flowbite-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const { theme, setTheme } = useTheme();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    if (!token) return;

    api
      .get(`/auth/verify-email/${token}`)
      .then(() => {
        toast.success("Email verified successfully ✅");
        setStatus("success");
      })
      .catch(() => {
        toast.error("Invalid or expired token");
        setStatus("error");
      });
  }, [token]);

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

            {/* STATUS */}
            {status === "loading" && (
              <>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4">
                  Verifying your email…
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4">
                  Your email has been successfully verified 🎉
                </p>
                <Button
                  href="/auth/login"
                  size="lg"
                  className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  Go to Login
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <p className="text-sm sm:text-base text-red-600 dark:text-red-400 mt-4">
                  Verification link is invalid or expired.
                </p>
                <Button
                  href="/auth/signup"
                  size="lg"
                  color="gray"
                  className="mt-6"
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
