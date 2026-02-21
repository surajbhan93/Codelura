"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  LayoutDashboard,
  Globe,
  Rocket,
  Code2,
  Star,
  Users,
  Calendar
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

const services = [
  {
    title: "E-Commerce Websites",
    desc: "High-performance online stores with payment gateway, cart, admin & order management.",
    icon: ShoppingCart,
    gradient: "from-orange-500 to-pink-500"
  },
  {
    title: "SaaS Dashboards",
    desc: "Scalable SaaS products with authentication, subscriptions & analytics.",
    icon: LayoutDashboard,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    title: "Startup Landing Pages",
    desc: "Conversion-focused landing pages for startups & product launches.",
    icon: Rocket,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Admin Panels",
    desc: "Secure admin panels with role-based access and data management.",
    icon: Code2,
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    title: "Portfolio Websites",
    desc: "Modern personal & business portfolios that build trust and visibility.",
    icon: Globe,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Full-Stack Projects",
    desc: "End-to-end full-stack solutions using modern tech stacks.",
    icon: LayoutDashboard,
    gradient: "from-cyan-500 to-blue-500"
  }
];

const clientLogos = [
  { name: "Fiverr", src: "/clients/fiverr.png" },
  { name: "Startup", src: "/clients/startup1.png" },
  { name: "Agency", src: "/clients/agency.png" },
  { name: "SaaS", src: "/clients/saas.png" },
  { name: "Ecommerce", src: "/clients/ecommerce.png" },
  { name: "Tech", src: "/clients/tech.png" }
];

export default function ServicesSection() {
  return (
    <SectionWrapper bg="bg-[#0f0f0f]">
      <div className="relative">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Website Development{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            We design and develop high-quality websites, SaaS platforms and e-commerce
            solutions trusted by clients worldwide.
          </p>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;

            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

                  {/* ICON */}
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${s.gradient} shadow-lg`}
                  >
                    <Icon size={26} className="text-white" />
                  </div>

                  {/* CONTENT */}
                  <h3 className="text-lg font-semibold text-white mb-2">
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

        {/* TRUST STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid gap-6 md:grid-cols-4 text-center"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Star className="mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-sm text-gray-400">Websites Delivered</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Calendar className="mx-auto mb-2 text-indigo-400" />
            <p className="text-2xl font-bold text-white">4+ Years</p>
            <p className="text-sm text-gray-400">Industry Experience</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Users className="mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold text-white">Global Clients</p>
            <p className="text-sm text-gray-400">Fiverr & Social Media</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Rocket className="mx-auto mb-2 text-pink-400" />
            <p className="text-2xl font-bold text-white">Startups & Brands</p>
            <p className="text-sm text-gray-400">Worldwide</p>
          </div>
        </motion.div>

{/* CLIENT LOGOS */}
<div className="mt-24">
  <h3 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-8">
    Trusted by startups, brands & global clients
  </h3>

  <div className="relative overflow-hidden">
    <motion.div
      className="flex gap-14 items-center"
      animate={{ x: ["0%", "-100%"] }}
      transition={{
        repeat: Infinity,
        duration: 25,
        ease: "linear"
      }}
    >
      {[...clientLogos, ...clientLogos].map((logo, i) => (
        <div
          key={i}
          className="flex items-center justify-center min-w-[160px]"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="h-10 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
          />
        </div>
      ))}
    </motion.div>
  </div>
</div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-block px-10 py-4 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 transition"
          >
            View All Services →
          </Link>
        </div>

      </div>
    </SectionWrapper>
  );
}
