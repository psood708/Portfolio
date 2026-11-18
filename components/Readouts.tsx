"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HALLUCINATIONS, PURITY_DEFAULT, bioForPurity, trainMessage } from "@/lib/content";
import { BOING, EASE_OUT } from "@/lib/motion";
import PurityDial from "./PurityDial";
import SectionStamp from "./SectionStamp";

/**
 * The instrument panel under the hero. Three readouts: the purity dial
 * rewrites the bio, the contaminants switch leaks a tall tale per flip, and
 * the yield bar fills twenty percent per precursor.
 */
export default function Readouts() {
  const [purity, setPurity] = useState(PURITY_DEFAULT);
  const [contam, setContam] = useState(false);
  const [tales, setTales] = useState(0);
  const [pct, setPct] = useState(0);

  const bio = bioForPurity(purity);
  const tale = HALLUCINATIONS[(tales - 1 + HALLUCINATIONS.length) % HALLUCINATIONS.length];

  const flip = () =>
    setContam((on) => {
      if (!on) setTales((n) => n + 1);
      return !on;
    });

  const feed = () => setPct((p) => (p >= 100 ? 0 : Math.min(100, p + 20)));

  return (
    <section className="mx-auto max-w-[1280px] px-5 md:px-8">
      <SectionStamp index="01" label="Readouts" className="mb-6" />

      <div className="panel-grid grid grid-cols-1 gap-8 rounded-[28px] border border-line bg-lab p-6 md:grid-cols-[1.25fr_1fr_1fr] md:gap-10 md:p-10">
        {/* ── purity → bio ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <PurityDial value={purity} onChange={setPurity} />
          <div className="relative min-h-[96px] md:min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={bio}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="m-0 max-w-[46ch] text-[16px] leading-[1.5] text-bone/90 md:text-[18px]"
              >
                {bio}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ── contaminants ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 border-t border-bone/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <span className="lab-label text-smoke">contaminants</span>
          <button
            type="button"
            onClick={flip}
            data-cursor="flip"
            role="switch"
            aria-checked={contam}
            aria-label="Contaminants"
            className="flex h-7 w-12 flex-none items-center rounded-full p-[3px] transition-colors duration-200"
            style={{
              justifyContent: contam ? "flex-end" : "flex-start",
              background: contam ? "var(--color-hazmat)" : "color-mix(in oklch, var(--color-bone) 15%, transparent)",
            }}
          >
            <motion.span layout transition={BOING} className="block size-[22px] rounded-full bg-bone" />
          </button>
          <div className="min-h-[96px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={contam ? `on-${tales}` : "off"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-2"
              >
                <span className="font-mono text-[13px]" style={{ color: contam ? "var(--color-hazmat)" : "var(--color-crystal)" }}>
                  {contam ? "contaminant detected" : "0 ppm"}
                </span>
                {contam && <p className="m-0 text-[15px] leading-[1.45] text-bone/85">{tale}</p>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── yield ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 border-t border-bone/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <span className="lab-label text-smoke">yield</span>
          <span className="font-mono text-[13px] text-bone">{trainMessage(pct)}</span>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "color-mix(in oklch, var(--color-bone) 12%, transparent)" }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Yield"
          >
            <motion.div
              className="h-full bg-hazmat"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
          </div>
          <button
            type="button"
            onClick={feed}
            data-cursor="add"
            className="self-start rounded-full border border-bone/30 px-4 py-2 font-mono text-[12px] text-bone transition-colors hover:border-hazmat hover:bg-hazmat hover:text-tar active:scale-95"
          >
            + precursor
          </button>
        </div>
      </div>
    </section>
  );
}
