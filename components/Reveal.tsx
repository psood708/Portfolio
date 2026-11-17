"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { clipUp, fadeUp, maskIn, viewportOnce } from "@/lib/motion";

export type RevealKind = "fade" | "wipe" | "mask";

type Props = HTMLMotionProps<"div"> & { kind?: RevealKind; delay?: number };

const VARIANTS = { fade: fadeUp, wipe: clipUp, mask: maskIn } as const;

/**
 * One reveal grammar: paragraphs fade up, headings wipe up from the baseline,
 * images unmask from an inset frame. Plays once, on scroll into view.
 *
 * Chrome counts `clip-path` against the intersection ratio, so a fully
 * clipped heading never reaches a 25% threshold. Wipes therefore fire on any
 * intersection; fades keep the quarter-visible rule.
 */
const ANY_PIXEL = { once: true, amount: "some" } as const;

export default function Reveal({ kind = "fade", delay = 0, children, ...rest }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={kind === "fade" ? viewportOnce : ANY_PIXEL}
      variants={VARIANTS[kind]}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
