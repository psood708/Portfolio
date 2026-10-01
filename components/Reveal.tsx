"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { revealVariants, viewportOnce } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number };

/** Fades a block up as it scrolls into view, once. */
export default function Reveal({ delay = 0, children, ...rest }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
      variants={revealVariants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
