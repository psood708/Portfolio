"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { clipUp, fadeUp, maskIn, viewportOnce } from "@/lib/motion";

export type RevealKind = "fade" | "wipe" | "mask";

type Props = HTMLMotionProps<"div"> & { kind?: RevealKind; delay?: number };

const VARIANTS = { fade: fadeUp, wipe: clipUp, mask: maskIn } as const;

/**
 * One reveal grammar: paragraphs fade up, headings wipe up from the baseline,
 * images unmask from an inset frame. Plays once, on scroll into view.
 */
export default function Reveal({ kind = "fade", delay = 0, children, ...rest }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
      variants={VARIANTS[kind]}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
