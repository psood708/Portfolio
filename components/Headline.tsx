"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HEADLINE_WORDS } from "@/lib/content";
import { tokenChild, tokenStream } from "@/lib/motion";

const REROLL_MS = 2000;

/**
 * The sub-headline under the title card: `Pure, applied AI. [word] of the
 * time.` The hazmat word rerolls itself every 2 s (click to force it; reduced
 * motion makes it click-only). The second line is one unbreakable line and
 * the longest variant fits it at every width, so swapping words only slides
 * the trailing text sideways — nothing below ever moves.
 */
export default function Headline() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const word = HEADLINE_WORDS[i % HEADLINE_WORDS.length];

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAuto(!calm.matches);
    sync();
    calm.addEventListener("change", sync);
    return () => calm.removeEventListener("change", sync);
  }, []);

  const advance = useCallback(() => setI((n) => n + 1), []);

  useEffect(() => {
    if (!auto) return;
    timer.current = setInterval(advance, REROLL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [auto, advance, i]);

  return (
    <motion.p
      initial="hidden"
      animate="shown"
      variants={tokenStream}
      className="m-0 font-display font-bold leading-[1.02] tracking-[-0.03em]"
      style={{ fontSize: "var(--text-sub)", fontVariationSettings: '"wdth" 88' }}
    >
      {["Pure,", "applied", "AI."].map((t) => (
        <motion.span key={t} variants={tokenChild} className="inline-block">
          {t}&nbsp;
        </motion.span>
      ))}
      <br />
      <motion.span variants={tokenChild} className="inline-flex items-baseline whitespace-nowrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={word}
            type="button"
            onClick={advance}
            data-cursor="reroll"
            aria-label={`Reroll, currently “${word}”`}
            initial={{ opacity: 0, y: "0.18em", filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-0.18em", filter: "blur(5px)" }}
            transition={{ duration: 0.28 }}
            className="inline-block select-none border-b-[3px] border-dashed pb-[0.02em] text-hazmat"
            style={{ borderColor: "color-mix(in oklch, var(--color-hazmat) 50%, transparent)" }}
          >
            {word}
          </motion.button>
        </AnimatePresence>
        <motion.span layout="position" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          &nbsp;of the time.
        </motion.span>
      </motion.span>
    </motion.p>
  );
}
