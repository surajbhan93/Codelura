"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Lock,
  Users,
  Rocket
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Explore Content",
    desc: "Read high-quality blogs, guides & learning material.",
    icon: BookOpen,
    color: "from-indigo-500 to-purple-500"
  },
  {
    step: "02",
    title: "Upgrade Access",
    desc: "Unlock premium resources & advanced features.",
    icon: Lock,
    color: "from-orange-500 to-pink-500"
  },
  {
    step: "03",
    title: "Get Mentored",
    desc: "Book 1-to-1 guidance sessions with experts.",
    icon: Users,
    color: "from-emerald-500 to-teal-500"
  },
  {
    step: "04",
    title: "Build & Earn",
    desc: "Build projects or hire us to grow your business.",
    icon: Rocket,
    color: "from-yellow-400 to-orange-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#060606] py-28 text-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-pink-500/20 blur-[120px]" />
      </div>

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
            How <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Codelura
            </span>{" "}
            Works
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A simple, structured and powerful journey to learn, build and grow with us.
          </p>
        </motion.div>

        {/* STEPS */}
        <div className="grid gap-10 md:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* GLASS CARD */}
                <div className="relative h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">

                  {/* STEP NUMBER */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div
                      className={`h-12 w-12 rounded-full bg-gradient-to-r ${s.color} flex items-center justify-center text-sm font-bold shadow-lg`}
                    >
                      {s.step}
                    </div>
                  </div>

                  {/* ICON */}
                  <div
                    className={`mx-auto mt-6 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${s.color} shadow-lg transition group-hover:scale-110`}
                  >
                    <Icon size={28} />
                  </div>

                  {/* TEXT */}
                  <h3 className="text-lg font-semibold mb-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
