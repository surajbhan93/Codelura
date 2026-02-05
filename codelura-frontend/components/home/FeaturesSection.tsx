"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BookOpen,
  Layers,
  UserCheck,
  Globe,
  ArrowRight
} from "lucide-react";
import Lottie from "lottie-react";

/* ---------------- FEATURES ---------------- */
const FEATURES = [
  {
    title: "Premium Learning Content",
    desc: "Real-world blogs, notes, and practical materials curated for developers.",
    details:
      "Learn with industry-grade content written from real production experience.",
    icon: BookOpen,
    lottie: "/lottie/learning.json"
  },
  {
    title: "Paid & Free Resources",
    desc: "Access both free and premium software learning resources in one place.",
    details:
      "Carefully curated tools, courses, and libraries — saving you weeks of research.",
    icon: Layers,
    lottie: "/lottie/resources.json"
  },
  {
    title: "1-to-1 Mentorship",
    desc: "Personal guidance sessions to fix your career roadmap and strategy.",
    details:
      "Direct sessions focused on resume, projects, interview prep, and clarity.",
    icon: UserCheck,
    lottie: "/lottie/mentorship.json"
  },
  {
    title: "Website Development Services",
    desc: "Professional websites built for startups, creators, and businesses.",
    details:
      "End-to-end website delivery — design, development, deployment & support.",
    icon: Globe,
    lottie: "/lottie/website.json"
  }
];

export default function FeaturesSection() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  /* Scroll-based highlight */
  const { scrollYProgress } = useScroll();
  const highlight = useTransform(scrollYProgress, [0.25, 0.6], [0, FEATURES.length - 1]);

  highlight.on("change", v => {
    setActive(Math.round(v));
  });

  return (
    <section className="relative bg-gradient-to-b from-[#0b0b0b] to-[#0f1020] py-28 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[260px] w-[260px] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}
        <h2 className="mb-20 text-center text-4xl font-bold">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Codelura
          </span>
        </h2>

        {/* MAIN GRID */}
        <div className="grid gap-14 md:grid-cols-2">

          {/* LEFT — FEATURES LIST */}
          <div className="space-y-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isActive = active === i;

              return (
                <motion.div
                  key={i}
                  onClick={() => {
                    setActive(i);
                    setOpen(open === i ? null : i);
                  }}
                  whileHover={{ x: 6 }}
                  className={`cursor-pointer rounded-2xl border p-6 transition
                    ${isActive ? "border-indigo-500 bg-white/10" : "border-white/10 bg-white/5"}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{f.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{f.desc}</p>

                      {/* Expandable details */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: open === i ? "auto" : 0,
                          opacity: open === i ? 1 : 0
                        }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm text-gray-300">
                          {f.details}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT — LOTTIE PREVIEW */}
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl"
          >
            <Lottie
              animationData={require(`../../public${FEATURES[active].lottie}`)}
              loop
              className="max-h-[360px]"
            />
          </motion.div>
        </div>

        {/* CTA STRIP */}
        <div className="mt-28 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-center shadow-2xl">
          <h3 className="mb-4 text-3xl font-bold">
            Ready to Build, Learn & Grow?
          </h3>
          <p className="mb-6 text-sm text-indigo-100">
            Join Codelura and accelerate your developer journey today.
          </p>
          <button className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-black/80">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
