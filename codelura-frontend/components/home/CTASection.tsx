"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-28">

      {/* GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

      {/* GLOW EFFECTS */}
      <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-black/30 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white"
      >
        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Build Skills That{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Get You Paid
          </span>
        </h2>

        {/* SUBTEXT */}
        <p className="mt-6 text-lg text-white/90 max-w-3xl mx-auto">
          Codelura helps you learn real-world development, build industry-grade projects,
          and unlock opportunities in jobs, freelancing, and startups.
        </p>

        {/* VALUE POINTS */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur">
            🚀 Learn by Building Real Projects
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur">
            💼 Get Job & Freelance Ready
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur">
            🌍 Work with Startups & Clients
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          <Link href="/pricing">
            <Button className="h-14 px-10 rounded-full bg-black text-white text-base font-semibold hover:bg-gray-900 shadow-xl">
              Get Started Now
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>

          <Link href="/services">
            <Button
              variant="outline"
              className="h-14 px-10 rounded-full border-white text-white text-base font-semibold hover:bg-white/10"
            >
              <Briefcase className="mr-2" size={18} />
              Hire Us
            </Button>
          </Link>
        </div>

        {/* TRUST LINE */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-14 text-sm text-white/80"
        >
          Trusted by <span className="font-semibold text-white">500+ clients</span> •
          4+ years of real-world development experience
        </motion.p>
      </motion.div>
    </section>
  );
}
