"use client";

import { motion } from "framer-motion";

export function BottomLine() {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "100px" }}
        transition={{ duration: 0.5 }}
        className="h-[4px] bg-primary rounded-full"
      />
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "60px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="h-[3px] bg-primary/60 rounded-full"
      />
    </div>
  );
}
