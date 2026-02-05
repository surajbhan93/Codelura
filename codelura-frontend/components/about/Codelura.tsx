"use client";

import { motion } from "framer-motion";

export function Codelura() {
  return (
    <section className="pt-24 px-4 md:px-12">
      {/* Heading */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-semibold">
          About <span className="text-primary">Codelura</span>
        </h1>
        <p className="mt-3 text-neutral-400 max-w-2xl mx-auto">
          A creative technology studio empowering businesses, brands, and
          learners in the digital era.
        </p>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center md:text-left"
      >
        <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
          <b className="text-white">Codelura</b> is a digital-first technology
          brand focused on building impactful online experiences through
          modern website design, performance-driven digital marketing, and
          mentorship-led learning.
          <br /><br />
          We help <b>startups, creators, MSMEs, and growing businesses</b> build
          scalable websites, strengthen their digital presence, and convert
          ideas into real-world products. Our approach blends creativity,
          engineering, and strategy to deliver solutions that are not only
          visually strong but also business-focused.
        </p>

        <p className="mt-6 text-neutral-300 text-sm md:text-base leading-relaxed">
          Beyond client services, Codelura also operates in the
          <b> B2C education space</b>, offering mentorship, structured notes,
          digital products, and learning resources for students and early-stage
          developers. Our goal is to bridge the gap between academic knowledge
          and industry-ready skills.
        </p>

        <p className="mt-6 text-neutral-300 text-sm md:text-base leading-relaxed">
          Whether it’s a <b>B2B collaboration</b> to scale a business or a
          <b> B2C offering</b> to empower learners, Codelura is built on
          transparency, quality, and long-term value creation.
        </p>
      </motion.div>

      {/* Focus Areas */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto"
      >
        {[
          "Website Design & Development",
          "Digital Marketing & Branding",
          "Mentorship & Career Guidance",
          "Educational Products & Notes",
        ].map((item) => (
          <div
            key={item}
            className="bg-[#313131] p-5 rounded-lg text-center text-sm md:text-base hover:scale-105 transition"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
