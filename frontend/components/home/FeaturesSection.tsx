"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Premium Learning Content",
    desc: "Real-world blogs, notes, and materials curated for developers."
  },
  {
    title: "Paid & Free Resources",
    desc: "Access both free and premium software learning material."
  },
  {
    title: "1-to-1 Mentorship",
    desc: "Personal guidance sessions to fix your career roadmap."
  },
  {
    title: "Website Development Services",
    desc: "Get professional websites built for startups & creators."
  }
];

export default function FeaturesSection() {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-14">
          Why Choose <span className="text-indigo-500">Codelura</span>
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-800 bg-[#0f0f0f] p-6 hover:border-indigo-500 transition"
            >
              <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
