"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HEADLINE_WORDS } from "@/lib/content";
import { tokenChild, tokenStream } from "@/lib/motion";

/**
 * Two annotations from the design live here: "headline types in word-by-word
 * like a token stream (stagger 60ms)" and "click the green words → regenerates
 * (variant cycle on tap, 5 variants)".
 *
 * The word also rerolls itself every 2s so the cycle is visible without being
 * discovered first. A manual click restarts the clock, so tapping never lands
 * right before an automatic flip. Anyone who prefers reduced motion gets the
 * click-only behaviour the design specified.
 *
 * Holding the layout still — the variants are different lengths, and swapping
 * them used to re-wrap the headline and shunt the page down by up to 134px.
 * Two things stop that now:
 *
 *   1. The word sits in an inline-grid slot where all five variants (plus the
 *      trailing full stop) are stacked in one cell. The slot is therefore
 *      always as wide as the widest variant, and `whitespace-nowrap` keeps each
 *      one on a single line, so the surrounding text wraps identically no
 *      matter which word is showing.
 *   2. `--text-hero` in globals.css is derived from that widest variant's
 *      measured width, so the slot always fits the line it is on.
 *
 * The net effect: same lines, same positions, same height, every reroll.
 */
const REROLL_MS = 2000;

export default function Headline() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const word = HEADLINE_WORDS[i % HEADLINE_WORDS.length];

  // Auto-cycling is motion; honour the OS setting and keep it live if it changes.
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAuto(!calm.matches);
    sync();
    calm.addEventListener("change", sync);
    return () => calm.removeEventListener("change", sync);
  }, []);

  const advance = useCallback(() => setI((n) => n + 1), []);

  // `i` is a dependency so a manual click rebuilds the interval from zero.
  useEffect(() => {
    if (!auto) return;
    timer.current = setInterval(advance, REROLL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [auto, advance, i]);

  return (
    <motion.h1
      initial="hidden"
      animate="shown"
      variants={tokenStream}
      className="m-0 text-hero font-extrabold leading-[0.88] tracking-[-0.05em] md:text-hero-wide md:leading-[0.86]"
    >
      {["I", "make", "LLMs"].map((t) => (
        <motion.span key={t} variants={tokenChild} className="inline-block">
          {t}&nbsp;
        </motion.span>
      ))}
      <br className="hidden md:block" />
      <motion.span variants={tokenChild} className="inline-block">
        do&nbsp;
      </motion.span>

      {/* Fixed-width, unbreakable slot — see the note above. */}
      <motion.span
        variants={tokenChild}
        className="inline-grid justify-items-start whitespace-nowrap"
      >
        {HEADLINE_WORDS.map((w) => (
          <span key={w} aria-hidden className="invisible [grid-area:1/1]">
            {w}.
          </span>
        ))}

        <span className="[grid-area:1/1]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={word}
              type="button"
              onClick={advance}
              data-cursor="reroll ↻"
              aria-label={`Reroll headline word, currently “${word}”`}
              initial={{ opacity: 0, y: "0.18em", filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: "-0.18em", filter: "blur(5px)" }}
              transition={{ duration: 0.28 }}
              className="inline-block select-none text-lime underline decoration-dashed decoration-4 underline-offset-[6px] transition-colors hover:text-violet md:decoration-[6px] md:underline-offset-[10px]"
              style={{ textDecorationColor: "oklch(0.86 0.17 125 / 0.35)" }}
            >
              {word}
            </motion.button>
          </AnimatePresence>
          <span className="text-violet">.</span>
        </span>
      </motion.span>
    </motion.h1>
  );
}
