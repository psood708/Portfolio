import type { Transition, Variants } from "framer-motion";

/** The overshoot curve on every springy hover and every tile pop. */
export const BOING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 18,
  mass: 0.7,
};

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Hard in, hard out: the page wipes and the mobile menu. */
export const EASE_WIPE = [0.76, 0, 0.24, 1] as const;

/** Every budget in one place, in seconds. */
export const DUR = {
  tile: 0.5,
  wipe: 0.6,
  reveal: 0.7,
  preloader: 2.8,
} as const;

/** Paragraphs and small blocks: 24px up, fade. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE_OUT },
  },
};

/** Headings: wiped up from the baseline, not faded. */
export const clipUp: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: 12 },
  shown: {
    clipPath: "inset(0 0 0 0)",
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE_WIPE },
  },
};

/** Images and plates: unmask from an inset frame. */
export const maskIn: Variants = {
  hidden: { clipPath: "inset(8% 8% 8% 8% round 16px)", scale: 1.04 },
  shown: {
    clipPath: "inset(0 0 0 0 round 16px)",
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

/** Grid children that cascade in rather than popping together. */
export const cascade = (stagger = 0.08): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: stagger } },
});

/** Word-by-word stream for the sub-headline. */
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

export const viewportOnce = { once: true, amount: 0.25 } as const;

/** @deprecated alias kept until the last Neural Arcade component is deleted. */
export const revealVariants = fadeUp;
