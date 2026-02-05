"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Code2,
  Briefcase,
  Rocket,
  BookOpen,
  Laptop
} from "lucide-react";

const useCases = [
  {
    title: "Students & Freshers",
    desc: "Preparing for tech jobs with structured learning, projects and interview-ready material.",
    icon: GraduationCap,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    title: "Developers",
    desc: "Upskilling in backend, frontend, system design and real-world architectures.",
    icon: Code2,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    title: "Freelancers",
    desc: "Building strong portfolios, landing clients and delivering professional projects.",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Startup Founders",
    desc: "Getting MVPs, landing pages, admin panels and scalable web solutions.",
    icon: Rocket,
    gradient: "from-orange-500 to-pink-500"
  },
  {
    title: "Self Learners",
    desc: "Accessing blogs, case studies and practical tutorials curated from industry experience.",
    icon: BookOpen,
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    title: "Hiring Companies",
    desc: "Finding skilled developers trained with real-world projects and production mindset.",
    icon: Laptop,
    gradient: "from-pink-500 to-rose-500"
  }
];

export default function UseCases() {
  return (
    <section className="relative bg-[#0b0b0b] py-28 text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Who Is{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Codelura
            </span>{" "}
            For?
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Codelura is built for learners, builders and businesses who believe
            in real skills, real projects and real outcomes.
          </p>
        </motion.div>

        {/* USE CASE CARDS */}
        <div className="grid gap-8 md:grid-cols-3">
          {useCases.map((u, i) => {
            const Icon = u.icon;

            return (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

                  {/* ICON */}
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${u.gradient} shadow-lg transition group-hover:scale-110`}
                  >
                    <Icon size={26} className="text-white" />
                  </div>

                  {/* CONTENT */}
                  <h3 className="text-lg font-semibold mb-2">
                    {u.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {u.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg font-medium text-gray-300">
            Learn. Build. Get Hired.{" "}
            <span className="text-indigo-400">That’s the Codelura way.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
