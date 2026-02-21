"use client";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";

const stats = [
  { label: "Developers Helped", value: "25K+" },
  { label: "Premium Resources", value: "1,200+" },
  { label: "1-to-1 Sessions", value: "3,500+" },
  { label: "Websites Built", value: "400+" }
];

export default function StatsSection() {
  return (
    <SectionWrapper bg="bg-[#0b0b0b]">
      <div className="grid gap-10 text-center text-white md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-4xl font-bold text-indigo-500">{s.value}</p>
            <p className="mt-2 text-sm text-gray-400">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
