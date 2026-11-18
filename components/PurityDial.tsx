"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { PURITY_MAX, purityLabel } from "@/lib/content";

type Props = { value: number; onChange: (v: number) => void };

const CX = 100;
const CY = 100;
const R = 82;

/**
 * A 180° gauge. The crystal arc and the needle follow `value`; the hazmat
 * tick marks 99.1. The real control is the range input underneath, which
 * keyboards and screen readers get for free.
 */
export default function PurityDial({ value, onChange }: Props) {
  const id = useId();
  const frac = Math.max(0, Math.min(1, value / PURITY_MAX));
  const angle = -180 + 180 * frac;

  return (
    <div className="flex flex-col gap-3">
      <svg viewBox="0 0 200 112" className="w-full max-w-[260px]" aria-hidden>
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="var(--color-crystal)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: frac }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        {/* ticks */}
        {[0, 0.25, 0.5, 0.75].map((t) => {
          const a = (Math.PI * (1 - t));
          return (
            <line
              key={t}
              x1={CX + Math.cos(a) * (R - 12)}
              y1={CY - Math.sin(a) * (R - 12)}
              x2={CX + Math.cos(a) * (R - 18)}
              y2={CY - Math.sin(a) * (R - 18)}
              stroke="var(--color-smoke)"
              strokeWidth="1.5"
            />
          );
        })}
        {/* the 99.1 tick */}
        <line
          x1={CX + R - 12}
          y1={CY}
          x2={CX + R - 22}
          y2={CY}
          stroke="var(--color-hazmat)"
          strokeWidth="3"
        />
        {/* needle */}
        <motion.g
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
          initial={{ rotate: -180 }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <line x1={CX} y1={CY} x2={CX + R - 26} y2={CY} stroke="var(--color-bone)" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
        <circle cx={CX} cy={CY} r="5" fill="var(--color-bone)" />
      </svg>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-[40px] font-bold leading-none tracking-[-0.03em] text-bone" style={{ fontVariationSettings: '"wdth" 85' }}>
          {value.toFixed(1)}
          <span className="text-[22px] text-smoke">%</span>
        </span>
        <span className="lab-label text-hazmat">{purityLabel(value)}</span>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={id} className="lab-label text-smoke">
          purity
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={PURITY_MAX}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          data-cursor="drag"
          aria-valuetext={`purity ${value.toFixed(1)} percent, ${purityLabel(value)}`}
          className="purity-range h-6 flex-1"
        />
      </div>
    </div>
  );
}
