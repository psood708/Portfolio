"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTransition } from "@/components/TransitionProvider";
import { EASE_OUT } from "@/lib/motion";

/** Remounts on every navigation: lifts the wipe and fades the new page up under it. */
export default function Template({ children }: { children: React.ReactNode }) {
  const { reveal } = useTransition();
  useEffect(() => {
    reveal();
  }, [reveal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
