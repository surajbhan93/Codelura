"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Code2, Rocket } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" }
  })
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black text-white">

      {/* 🌌 GRADIENT & GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[160px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] bg-purple-600/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-28 text-center">

        {/* 🚀 BADGE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Badge className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-2 text-sm text-gray-300 border border-gray-700">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Build • Learn • Monetize with Codelura
          </Badge>
        </motion.div>

        {/* 🧠 HEADING */}
        <motion.h1
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl"
        >
          The Ultimate Platform for{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Developers
          </span>
          <br />
          to Learn, Build & Earn
        </motion.h1>

        {/* 📄 DESCRIPTION */}
        <motion.p
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
        >
          Codelura is a premium developer ecosystem.  
          Learn from real-world blogs, access curated resources,
          get expert mentorship, and launch professional websites —
          all from one powerful platform.
        </motion.p>

        {/* 🎯 CTA BUTTONS */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <Link href="/pricing">
            <Button className="h-12 rounded-full bg-indigo-600 px-8 text-base hover:bg-indigo-700 shadow-lg shadow-indigo-600/30">
              <Rocket className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </Link>

          <Link href="/blogs">
            <Button
              variant="outline"
              className="h-12 rounded-full border-gray-700 px-8 text-base text-white hover:bg-white hover:text-black"
            >
              <Code2 className="mr-2 h-4 w-4" />
              Explore Content
            </Button>
          </Link>
        </motion.div>

        {/* 🖼️ FLOATING VISUAL */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-2xl border border-gray-800 bg-[#0b0b0b] p-4 shadow-2xl"
          >
            <Image
              src="/hero-dashboard.png"   // 👈 apna SaaS / code dashboard image
              alt="Codelura Platform"
              width={1200}
              height={700}
              className="rounded-xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* 🏆 TRUST STRIP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-20 grid gap-10 text-sm text-gray-400 md:grid-cols-3"
        >
          <div>
            <p className="text-xl font-bold text-white">Premium Content</p>
            <p>Industry-ready blogs & curated learning</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">Mentorship</p>
            <p>1-to-1 guidance & career-focused sessions</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">Website Services</p>
            <p>Enterprise-grade websites built by experts</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
