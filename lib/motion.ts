import type { Transition, Variants } from "framer-motion";

/** The overshoot curve the design puts on every springy hover. */
export const BOING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 18,
  mass: 0.7,
};

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Section-level scroll reveal. Used by <Reveal>. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

/**
 * Headline token stream: "types in word-by-word like a token stream
 * (Appear, stagger 60ms)" — straight from the design annotation.
 */
export const tokenStream: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

export const tokenChild: Variants = {
  hidden: { opacity: 0, y: "0.22em", filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: EASE_OUT },
  },
};

/** Grid children that cascade in rather than popping together. */
export const cascade = (stagger = 0.08): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: stagger } },
});

export const viewportOnce = { once: true, amount: 0.25 } as const;
