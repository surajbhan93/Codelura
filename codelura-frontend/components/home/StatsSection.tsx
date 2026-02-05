"use client";
import LiveCodeEditor from "@/components/shared/LiveCodeEditor";

/* ...inside JSX... */

<div>
  <LiveCodeEditor />
</div>

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform
} from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";

/* ------------------ API (MOCK) ------------------ */
// Later replace with real backend endpoint
async function fetchStats() {
  return {
    developers: 25000,
    resources: 1200,
    sessions: 3500,
    websites: 400
  };
}

/* ------------------ SVG LOGOS ------------------ */
const Logos = () => (
  <div className="flex flex-wrap items-center justify-center gap-10 opacity-80">
    {["Google", "Amazon", "Microsoft", "Meta"].map((name, i) => (
      <svg
        key={i}
        width="90"
        height="28"
        viewBox="0 0 100 30"
        fill="none"
        className="text-gray-400"
      >
        <text
          x="0"
          y="20"
          fill="currentColor"
          fontSize="18"
          fontWeight="600"
        >
          {name}
        </text>
      </svg>
    ))}
  </div>
);

/* ------------------ COUNT UP ------------------ */
function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = value / 60;

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
}

/* ------------------ STATS SECTION ------------------ */
export default function StatsSection() {
  const sectionRef = useRef(null);
  const [data, setData] = useState<any>(null);

  /* Lazy Load API */
  const inView = useInView(sectionRef, { once: true });

  useEffect(() => {
    if (inView && !data) {
      fetchStats().then(setData);
    }
  }, [inView, data]);

  /* Hero → Stats Scroll Sync */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* Sound (Desktop only) */
  const playSound = () => {
    if (window.innerWidth < 768) return;
    const audio = new Audio("/sounds/mixkit-interface-device-click-2577.wav");
    audio.volume = 0.15;
    audio.play();
  };

  if (!data) return <div ref={sectionRef} />;

  return (
    <SectionWrapper bg="bg-gradient-to-b from-[#0b0b0b] to-[#0f1020]">
      <div ref={sectionRef} className="space-y-24">

        {/* ---------------- TIMELINE ---------------- */}
        <div className="grid gap-16 md:grid-cols-2">

          {/* LEFT — TIMELINE */}
          <div className="relative pl-10">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-2 top-0 w-[2px] bg-indigo-500"
            />

            {[
              { label: "Developers Helped", value: data.developers },
              { label: "Premium Resources", value: data.resources },
              { label: "1-to-1 Sessions", value: data.sessions },
              { label: "Websites Built", value: data.websites }
            ].map((s, i) => (
              <motion.div
                key={i}
                onMouseEnter={playSound}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative mb-14"
              >
                <span className="absolute -left-[30px] top-3 h-4 w-4 rounded-full bg-indigo-500" />

                <p className="text-4xl font-bold text-white">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-1 text-sm text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* RIGHT — CODE */}
          {/* RIGHT — ADVANCED CODE BLOCK */}
          <LiveCodeEditor />


        </div>

        {/* ---------------- TRUST STRIP ---------------- */}
        <div className="text-center space-y-6">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Trusted by developers at
          </p>
          <Logos />
        </div>

      </div>
    </SectionWrapper>
  );
}
