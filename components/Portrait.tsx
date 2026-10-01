"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BOING } from "@/lib/motion";

/** The `togglePortrait` gag: click to swap serious for goofy and back. */
export default function Portrait() {
  const [goofy, setGoofy] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => setGoofy((g) => !g)}
      data-cursor="boop"
      aria-pressed={goofy}
      whileTap={{ scale: 0.98, rotate: goofy ? 1.5 : -1.5 }}
      transition={BOING}
      className="hatch flex aspect-4/5 w-full select-none items-center justify-center rounded-[24px] px-6 text-center font-mono text-xs text-mute-4"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={goofy ? "goofy" : "serious"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {goofy
            ? "goofy photo (click to be serious)"
            : "portrait (click for goofy)"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
