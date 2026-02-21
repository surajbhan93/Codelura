"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">
          Start Your Journey with Codelura
        </h2>
        <p className="mb-10 text-lg">
          Learn smarter, build faster, and monetize your skills with confidence.
        </p>

        <Link href="/pricing">
          <Button className="h-12 rounded-full bg-black px-8 text-base hover:bg-gray-900">
            Get Started Now
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
