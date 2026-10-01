"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { FILTERS, PROJECTS, type Filter } from "@/lib/content";
import { BOING, EASE_OUT } from "@/lib/motion";
import Hatch from "./Hatch";

const GRID = "grid-cols-[56px_minmax(0,1fr)_300px_140px_80px]";

/**
 * The work index. Three annotations from the design:
 *   · filters behave like a CMS filter (and drive the `({count})` superscript)
 *   · row hover shifts the text 12px right
 *   · a floating preview follows the cursor while a row is hovered
 *
 * The preview position is spring-damped so it trails the pointer rather than
 * snapping to it, which is what Framer's own cursor-follow component does.
 */
export default function WorkTable() {
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const shown =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));
  const count = String(shown.length).padStart(2, "0");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const py = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });

  const track = (e: React.PointerEvent) => {
    mx.set(e.clientX + 28);
    my.set(e.clientY - 90);
  };

  const preview = shown.find((p) => p.slug === hovered);

  return (
    <>
      {/* ── heading + filters ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
        <h1 className="m-0 text-page font-extrabold leading-[0.85] tracking-[-0.05em]">
          Work
          <sup className="align-super text-[0.26em] tracking-normal text-lime">
            ({count})
          </sup>
        </h1>
        <div className="flex flex-wrap gap-2 text-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              data-cursor="filter"
              aria-pressed={filter === f}
              className="rounded-full border border-line-2 px-4 py-[9px] transition-colors duration-150"
              style={
                filter === f
                  ? { background: "var(--color-bone)", color: "var(--color-ink)" }
                  : undefined
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── column headers (desktop only) ──────────────────────────────── */}
      <div
        className={`hidden gap-6 border-b border-line pb-3 font-mono text-[11px] text-mute-3 md:grid ${GRID}`}
      >
        <span>#</span>
        <span>PROJECT</span>
        <span>STACK</span>
        <span>IMPACT</span>
        <span className="text-right">YEAR</span>
      </div>

      {/* ── rows ───────────────────────────────────────────────────────── */}
      <div onPointerMove={track}>
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((p) => (
            <motion.a
              key={p.slug}
              id={p.slug}
              href={`#${p.slug}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              onPointerEnter={() => setHovered(p.slug)}
              onPointerLeave={() => setHovered(null)}
              data-cursor="view ↗"
              className={`flex scroll-mt-24 flex-col gap-3 border-b border-line py-6 transition-[padding,background] duration-250 hover:bg-row-hover hover:pl-3.5 md:grid md:items-center md:gap-6 md:py-7 ${GRID}`}
            >
              <span className="font-mono text-[13px] text-mute-3">{p.num}</span>

              <div className="min-w-0">
                <div className="text-[28px] font-semibold leading-none tracking-[-0.03em] md:text-[40px]">
                  {p.name}
                </div>
                <div className="mt-1.5 text-[15px] text-mute-1">{p.line}</div>
              </div>

              <span className="font-mono text-xs text-mute-2">{p.stack}</span>

              <span className="text-lg font-extrabold text-lime md:text-[22px]">
                {p.metric}{" "}
                <span className="font-mono text-[11px] font-normal text-mute-2 md:hidden">
                  {p.metricLabel}
                </span>
              </span>

              <span className="font-mono text-[13px] text-mute-3 md:text-right">
                {p.year}
              </span>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center font-mono text-sm text-mute-3">
          Nothing tagged {filter} yet. Try All.
        </p>
      )}

      {/* ── cursor-following preview ───────────────────────────────────── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key={preview.slug}
            aria-hidden
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={BOING}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[260px] overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-2xl md:block"
          >
            <Hatch label={preview.shot} />
            <div className="px-4 py-3 font-mono text-[11px] text-mute-2">
              {preview.name} · {preview.year}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
