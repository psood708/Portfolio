"use client";

import { motion } from "framer-motion";
import { chromatogramPath } from "@/lib/chromatogram";
import { ELEMENTS, tileFor } from "@/lib/elements";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import ElementTile from "./ElementTile";

type Props = {
  seed: string;
  symbols: string[];
  number: string;
  className?: string;
};

const W = 400;
const H = 200;

/**
 * What a card shows when it has no screenshot yet: the project's stack laid
 * out like a fragment of the periodic table, its batch number stamped faintly
 * behind, and a chromatogram trace generated from its slug. Designed to be
 * seen, not a placeholder.
 */
export default function SpectrumPlate({ seed, symbols, number, className = "" }: Props) {
  const d = chromatogramPath(seed, W, H);
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: "color-mix(in oklch, var(--color-lab) 55%, var(--color-tar))" }}
    >
      <span
        aria-hidden
        className="display-condensed pointer-events-none absolute -bottom-[0.18em] -right-[0.04em] font-display font-extrabold leading-none"
        style={{ fontSize: "min(46%, 150px)", color: "color-mix(in oklch, var(--color-bone) 6%, transparent)" }}
      >
        {number}
      </span>

      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d={d}
          fill="none"
          stroke="var(--color-crystal)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={viewportOnce}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        />
      </svg>

      <div className="absolute left-4 top-4 grid grid-cols-4 gap-1.5 md:left-5 md:top-5">
        {symbols.slice(0, 5).map((s, i) => (
          <div key={s} style={i === 4 ? { gridColumnStart: 2 } : undefined}>
            <ElementTile element={ELEMENTS[s] ?? tileFor(s)} size="md" tone={i === 0 ? "element" : "outline"} />
          </div>
        ))}
      </div>
    </div>
  );
}
