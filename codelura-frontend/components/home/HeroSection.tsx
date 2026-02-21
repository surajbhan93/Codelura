"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Code2,
  Rocket,
  BarChart3,
  Terminal,
  GraduationCap,
  Play
} from "lucide-react";

/* ------------------ Auto Typing ------------------ */
const words = ["Scale You", "Build Faster", "Ship Better"];

function TypingText() {
  const [text, setText] = useState("");
  const [word, setWord] = useState(0);
  const [char, setChar] = useState(0);

  useEffect(() => {
    const current = words[word];
    if (char < current.length) {
      const t = setTimeout(() => {
        setText(prev => prev + current[char]);
        setChar(char + 1);
      }, 90);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText("");
        setChar(0);
        setWord((word + 1) % words.length);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [char, word]);

  return (
    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* ------------------ Magnetic Button ------------------ */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------ Floating Card ------------------ */
function FloatingCard({
  icon: Icon,
  title,
  className
}: {
  icon: any;
  title: string;
  className: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute rounded-xl border border-white/20 bg-white/30 backdrop-blur-xl px-4 py-3 shadow-lg dark:bg-black/40 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
        <Icon className="h-4 w-4 text-indigo-500" />
        {title}
      </div>
    </motion.div>
  );
}

/* ------------------ Code Overlay ------------------ */
function CodeOverlay() {
  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="absolute bottom-6 left-6 hidden w-[260px] rounded-xl bg-black/80 p-4 text-xs text-green-400 backdrop-blur md:block"
    >
{`fetch("/api/projects")
  .then(res => res.json())
  .then(data => {
    console.log("Codelura 🚀", data)
  })`}
    </motion.pre>
  );
}


/* ------------------ HERO ------------------ */
export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["20%", "80%"]);
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0b0b15] dark:via-[#0e0e18] dark:to-[#140c1f]">

      {/* 🌈 Background Glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          style={{ y: imageY }}
          className="absolute left-1/3 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[150px]"
        />
        <motion.div
          style={{ y: imageY }}
          className="absolute right-0 top-0 h-[420px] w-[420px] bg-purple-500/20 blur-[150px]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            {/* <Badge className="mb-6 inline-flex items-center gap-2 rounded-full 
          bg-white/60 px-5 py-2 text-sm 
          border border-white/40 shadow-md backdrop-blur-md">
            <Sparkles className="h-4 w-4 stroke-indigo-500" />
            Build • Learn • Monetize
          </Badge> */}



            <h1 className="max-w-xl text-2xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-6xl">
              Developer Platform
              <span className="block">
                Built to <TypingText />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
              Blogs, mentorship, SaaS tools & professional websites —
              everything a modern developer needs in one ecosystem.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Magnetic>
                <Link href="/pricing">
                  <Button className="h-12 rounded-full bg-indigo-600 px-8 text-base text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30">
                    <Rocket className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
              </Magnetic>

              <Magnetic>
                <Button
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="h-12 rounded-full px-8 text-base"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </Magnetic>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            style={{ y: imageY, "--spot": glowY } as any}
            className="relative"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background:
                  "radial-gradient(500px at 50% var(--spot), rgba(99,102,241,0.25), transparent 70%)"
              }}
            />

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl border border-white/20 bg-white/30 p-4 backdrop-blur-xl shadow-2xl dark:bg-black/40"
            >
              <Image
                src="/home/hero-dashboard.png"
                alt="Codelura Dashboard"
                width={1200}
                height={720}
                className="rounded-xl"
                priority
              />

              <FloatingCard icon={BarChart3} title="Live Analytics" className="-top-6 left-8" />
              <FloatingCard icon={Terminal} title="Code Playground" className="top-1/3 -right-8" />
              <FloatingCard icon={GraduationCap} title="Expert Mentorship" className="-bottom-6 right-12" />
               <CodeOverlay />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-[90%] max-w-3xl rounded-xl bg-black p-4"
          >
            <iframe
              className="h-[320px] w-full rounded-lg md:h-[420px]"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
