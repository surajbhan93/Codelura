"use client";

import { motion } from "framer-motion";

const steps = [
  { step: "01", title: "Explore Content", desc: "Read blogs & learning material." },
  { step: "02", title: "Upgrade Access", desc: "Unlock premium resources." },
  { step: "03", title: "Get Mentored", desc: "Book 1-to-1 guidance sessions." },
  { step: "04", title: "Build & Earn", desc: "Use skills or hire us for websites." }
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0b0b0b] text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-14">
          How <span className="text-indigo-500">Codelura</span> Works
        </h2>

        <div className="grid gap-10 md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
