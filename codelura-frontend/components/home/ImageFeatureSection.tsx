"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Briefcase,
  Code2,
  GraduationCap,
  CheckCircle
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function ImageFeatureSection() {
  return (
    <SectionWrapper bg="bg-[#0b0b0b]">
      <div className="relative overflow-hidden">

        {/* BACKGROUND GLOW */}
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px]" />

        <div className="relative z-10 grid items-center gap-16 md:grid-cols-2">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Learn with{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Real-World Content
              </span>
            </h2>

            <p className="mt-5 text-gray-400 leading-relaxed">
              Codelura is built for developers who don’t just want certificates —
              but <span className="text-white font-medium">real skills, real projects, and real jobs</span>.
            </p>

            {/* FEATURES */}
            <ul className="mt-8 space-y-4 text-gray-300 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-indigo-400" size={18} />
                Practical tutorials based on industry problems
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-indigo-400" size={18} />
                Interview-oriented backend & frontend preparation
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-indigo-400" size={18} />
                Free + premium content curated by working engineers
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-indigo-400" size={18} />
                Mentorship, referrals & hiring opportunities
              </li>
            </ul>

            {/* CAREER STRIP */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
                <Code2 className="mx-auto mb-1 text-indigo-400" size={18} />
                Build Projects
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
                <GraduationCap className="mx-auto mb-1 text-purple-400" size={18} />
                Learn by Doing
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
                <Briefcase className="mx-auto mb-1 text-emerald-400" size={18} />
                Get Hired
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 transition">
                Start Learning
              </button>
              <button className="px-8 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition">
                View Job Programs
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl" />

            <Image
              src="/home/learning.jpg"
              alt="Codelura Learning"
              width={520}
              height={380}
              className="relative rounded-3xl border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
