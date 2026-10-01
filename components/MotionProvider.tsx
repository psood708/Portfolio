"use client";

import { MotionConfig } from "framer-motion";

/**
 * `reducedMotion="user"` makes every Framer Motion animation in the tree honour
 * `prefers-reduced-motion`: transforms and opacity stop animating, layout
 * animations are skipped. The CSS-driven pieces (marquee, caret) opt out in
 * globals.css, and NeuralCursor disables itself outright.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
