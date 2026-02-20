"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, AlertCircle } from "lucide-react";
import { Card } from "flowbite-react";

interface BlogSummaryProps {
  summary: string;
}

export default function BlogSummary({ summary }: BlogSummaryProps) {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-8"
    >
      <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                AI Summary (TL;DR)
              </h3>
              <div className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                BETA
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm italic">
              "{summary}"
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 italic">
              <Bot size={12} />
              Generated automatically by Codelura AI
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
