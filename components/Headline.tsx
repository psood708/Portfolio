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
 * Reflow: the variants are different lengths — "less dumb stuff" takes a line
 * that "the math" does not — so swapping them would shunt the whole page down.
 * Every variant is therefore also rendered as an invisible sizer in the same
 * grid cell, making the block as tall as its tallest state at any width. The
 * sizers reuse the exact markup of the live headline (same inline-block spans,
 * same non-breaking spaces), because plain text wraps at different points than
 * a row of inline-blocks and would reserve the wrong height.
 */
const REROLL_MS = 2000;

const TYPE =
  "m-0 text-hero font-extrabold leading-[0.88] tracking-[-0.05em] md:leading-[0.86]";
const WORD =
  "inline-block select-none text-left align-top text-lime underline decoration-dashed decoration-4 underline-offset-[6px] md:decoration-[6px] md:underline-offset-[10px]";

/** The fixed part of the headline, identical in the live copy and the sizers. */
function Prefix({ animated }: { animated: boolean }) {
  const Span = animated ? motion.span : "span";
  const v = animated ? { variants: tokenChild } : {};
  return (
    <>
      {["I", "make", "LLMs"].map((t) => (
        <Span key={t} {...v} className="inline-block">
          {t}&nbsp;
        </Span>
      ))}
      <br className="hidden md:block" />
      <Span {...v} className="inline-block">
        do&nbsp;
      </Span>
    </>
  );
}

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
    <div className="grid">
      {HEADLINE_WORDS.map((w) => (
        <div key={w} aria-hidden className={`${TYPE} invisible [grid-area:1/1]`}>
          <Prefix animated={false} />
          <span className={WORD}>{w}</span>
          <span className="inline-block text-violet">.</span>
        </div>
      ))}

      <motion.h1
        initial="hidden"
        animate="shown"
        variants={tokenStream}
        className={`${TYPE} [grid-area:1/1]`}
      >
        <Prefix animated />

        <motion.span variants={tokenChild} className="inline-block">
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
              className={`${WORD} transition-colors hover:text-violet`}
              style={{ textDecorationColor: "oklch(0.86 0.17 125 / 0.35)" }}
            >
              {word}
            </motion.button>
          </AnimatePresence>
        </motion.span>

        <motion.span variants={tokenChild} className="inline-block text-violet">
          .
        </motion.span>
      </motion.h1>
    </div>
  );
}
