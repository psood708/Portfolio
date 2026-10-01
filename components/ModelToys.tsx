"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HALLUCINATIONS, trainMessage } from "@/lib/content";
import { BOING } from "@/lib/motion";

/**
 * The two gags sitting under the hero: a hallucinations switch that emits a
 * tall tale per flip, and a training bar fed 20% at a time by "+ data". Both
 * reproduce the `toggleHalluc` / `feed` reducers from the design's logic class,
 * including the wrap-around to a fresh run at 100%.
 */
export default function ModelToys() {
  const [halluc, setHalluc] = useState(false);
  const [hi, setHi] = useState(0);
  const [pct, setPct] = useState(0);

  const flip = () =>
    setHalluc((on) => {
      if (!on) setHi((n) => n + 1);
      return !on;
    });

  const feed = () => setPct((p) => (p >= 100 ? 0 : Math.min(100, p + 20)));

  const tale = HALLUCINATIONS[(hi - 1 + HALLUCINATIONS.length) % HALLUCINATIONS.length];

  return (
    <div className="flex flex-col gap-5 font-mono text-xs text-mute-3 md:flex-row md:items-center md:justify-between md:gap-6">
      {/* ── hallucinations ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={flip}
          data-cursor="flip"
          role="switch"
          aria-checked={halluc}
          aria-label="Hallucinations"
          className="flex h-5 w-[34px] flex-none items-center rounded-full p-[3px] transition-colors duration-200"
          style={{
            justifyContent: halluc ? "flex-end" : "flex-start",
            background: halluc ? "var(--color-lime)" : "var(--color-line-2)",
          }}
        >
          <motion.span layout transition={BOING} className="block size-3.5 rounded-full bg-bone" />
        </button>
        <AnimatePresence mode="wait">
          <motion.span
            key={halluc ? `on-${hi}` : "off"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="leading-relaxed"
            style={{ color: halluc ? "var(--color-bone)" : "var(--color-mute-3)" }}
          >
            {halluc ? tale : "hallucinations: off"}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── training bar ────────────────────────────────────────────────── */}
      <div className="flex flex-none items-center gap-3">
        <span className="whitespace-nowrap">{trainMessage(pct)}</span>
        <div
          className="h-[3px] w-[72px] overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Training progress"
        >
          <motion.div
            className="h-full bg-violet"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
        <button
          type="button"
          onClick={feed}
          data-cursor="nom"
          className="flex-none rounded-full border border-line-2 px-2.5 py-[5px] font-mono text-[11px] text-mute-1 transition-colors hover:border-violet hover:text-violet active:scale-90"
        >
          + data
        </button>
      </div>
    </div>
  );
}
