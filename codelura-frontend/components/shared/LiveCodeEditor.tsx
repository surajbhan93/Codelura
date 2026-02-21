"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";

/* ---------------- CODE ---------------- */
const CODE_LINES = [
  `import { useScroll, animate } from "codelura-motion";`,
  ``,
  `// Timeline driven developer impact 🚀`,
  `export async function loadStatsTimeline() {`,
  `  const response = await fetch("/api/stats");`,
  `  const timeline = await response.json();`,
  ``,
  `  timeline.forEach((step, index) => {`,
  `    animate(step.element, { opacity: 1, y: 0, delay: index * 0.15 });`,
  `  });`,
  `}`,
  ``,
  `console.log("Build • Learn • Monetize 🚀");`
];

/* ---------------- TOKEN COLORS ---------------- */
function renderLine(line: string) {
  const tokens = line.split(/(\s+)/);

  return tokens.map((token, i) => {
    if (
      [
        "import",
        "export",
        "async",
        "function",
        "const",
        "return",
        "await"
      ].includes(token)
    ) {
      return (
        <span key={i} className="text-purple-400">
          {token}
        </span>
      );
    }

    if (token.startsWith('"') && token.endsWith('"')) {
      return (
        <span key={i} className="text-green-400">
          {token}
        </span>
      );
    }

    if (
      ["animate", "fetch", "console", "log"].some(k =>
        token.includes(k)
      )
    ) {
      return (
        <span key={i} className="text-yellow-300">
          {token}
        </span>
      );
    }

    if (!isNaN(Number(token))) {
      return (
        <span key={i} className="text-sky-400">
          {token}
        </span>
      );
    }

    return <span key={i}>{token}</span>;
  });
}

/* ---------------- COMPONENT ---------------- */
export default function LiveCodeEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLine, setActiveLine] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const activeLineMotion = useTransform(
    scrollYProgress,
    [0, 1],
    [0, CODE_LINES.length - 1]
  );

  useEffect(() => {
    const unsub = activeLineMotion.on("change", v =>
      setActiveLine(Math.round(v))
    );
    return () => unsub();
  }, [activeLineMotion]);

  /* Typing */
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (index >= CODE_LINES.length) {
          clearInterval(interval);
          return prev;
        }
        return [...prev, CODE_LINES[index++]];
      });
    }, 260);
    return () => clearInterval(interval);
  }, []);

  /* Cursor */
  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(blink);
  }, []);

  const copyCode = async () => {
    await navigator.clipboard.writeText(CODE_LINES.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-gray-400">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="p-6 font-mono text-sm leading-relaxed text-gray-200">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className={`flex gap-4 rounded-md px-2
              ${activeLine === i ? "bg-indigo-500/20" : ""}
            `}
          >
            <span className="select-none text-gray-500">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="whitespace-pre">
              {renderLine(line)}
            </span>
          </div>
        ))}

        {visibleLines.length < CODE_LINES.length && (
          <span className="ml-8 text-indigo-400">
            {cursor ? "|" : ""}
          </span>
        )}
      </div>
    </motion.div>
  );
}
