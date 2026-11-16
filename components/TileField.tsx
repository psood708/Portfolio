"use client";

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { tileFor } from "@/lib/elements";
import { BOING } from "@/lib/motion";
import ElementTile, { type TileTone } from "./ElementTile";

type Props = { symbols: string[] };

/** 12 slots on a jittered 4×3 grid, as percentages of the field. */
const SLOTS = [
  { x: 4, y: 6, d: 1, r: -5 },
  { x: 30, y: 2, d: 3, r: 4 },
  { x: 58, y: 9, d: 2, r: -3 },
  { x: 82, y: 1, d: 1, r: 6 },
  { x: 12, y: 36, d: 2, r: 3 },
  { x: 40, y: 31, d: 1, r: -6 },
  { x: 66, y: 40, d: 3, r: 2 },
  { x: 88, y: 34, d: 2, r: -4 },
  { x: 2, y: 68, d: 3, r: 5 },
  { x: 28, y: 74, d: 2, r: -2 },
  { x: 56, y: 66, d: 1, r: 4 },
  { x: 80, y: 72, d: 3, r: -5 },
] as const;

const TONES: TileTone[] = [
  "element", "element", "outline", "element", "crystal", "element",
  "element", "outline", "element", "element", "element", "outline",
];

function FieldTile({
  symbol, slot, tone, progress, px, py,
}: {
  symbol: string;
  slot: (typeof SLOTS)[number];
  tone: TileTone;
  progress: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const depth = slot.d * 40;
  const y = useTransform(progress, [0, 1], [0, -depth]);
  const tx = useTransform(px, (v) => v * 6 * slot.d * 0.5);
  const ty = useTransform(py, (v) => v * 6 * slot.d * 0.5);
  return (
    <motion.div
      className="absolute"
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...BOING, delay: 0.6 + slot.d * 0.12 }}
    >
      <motion.div style={{ x: tx, y: ty, rotate: slot.r }} whileHover={{ scale: 1.12, rotate: 0 }} transition={BOING}>
        <ElementTile element={tileFor(symbol)} size="md" tone={tone} flip />
      </motion.div>
    </motion.div>
  );
}

/**
 * The stack as a drifting field of tiles beside the title card. Scroll pulls
 * each one up at its own depth; the pointer tilts the field a few pixels.
 * On phones it collapses to one horizontal strip.
 */
export default function TileField({ symbols }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const tilt = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const shown = symbols.slice(0, SLOTS.length);

  return (
    <>
      <div
        ref={ref}
        onPointerMove={tilt}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        className="relative hidden h-[420px] md:block"
        aria-hidden
      >
        {shown.map((s, i) => (
          <FieldTile
            key={s}
            symbol={s}
            slot={SLOTS[i]}
            tone={TONES[i]}
            progress={scrollYProgress}
            px={px}
            py={py}
          />
        ))}
      </div>

      <ul className="-mx-5 flex list-none gap-2 overflow-x-auto px-5 pb-1 md:hidden [scrollbar-width:none]">
        {shown.map((s) => {
          const e = tileFor(s);
          return (
            <li key={s} className="flex shrink-0 flex-col items-center gap-1.5">
              <ElementTile element={e} size="md" />
              <span className="font-mono text-[10px] text-smoke">{e.name}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
