"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import type { CardData } from "@/lib/cards";
import { stackSymbols, tileFor } from "@/lib/elements";
import {
  INVENTORY_FILTERS,
  filterFromHash,
  filterInventory,
  type InventoryFilter,
} from "@/lib/inventory";
import { BOING, EASE_OUT } from "@/lib/motion";
import BatchCard from "./BatchCard";
import ElementTile from "./ElementTile";
import Shot from "./Shot";

type Card = CardData & { image: string | null };
type Props = { cards: Card[] };

/**
 * Every batch and experiment in one grid. Filters are tiles (hazmat when
 * active), the count is a tile, and a crystal-tinted preview trails the
 * pointer over whichever card is hovered. `/work#experiments` preselects
 * the experiments filter and scrolls to the anchor.
 */
export default function Inventory({ cards }: Props) {
  const [filter, setFilter] = useState<InventoryFilter>("All");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const f = filterFromHash(window.location.hash);
    if (f === "All") return;
    setFilter(f);
    requestAnimationFrame(() => {
      document.getElementById("experiments")?.scrollIntoView({ block: "start" });
    });
  }, []);

  const shown = filterInventory(cards, filter);
  const count = String(shown.length).padStart(2, "0");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const py = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });
  const track = (e: React.PointerEvent) => {
    mx.set(e.clientX + 28);
    my.set(e.clientY - 90);
  };
  const preview = shown.find((c) => c.key === hovered);

  return (
    <>
      <div className="flex flex-col gap-8 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
        <h1 className="display-condensed m-0 flex items-end gap-4 font-display font-extrabold leading-[0.85] tracking-[-0.04em]" style={{ fontSize: "var(--text-page)" }}>
          Inventory
          <ElementTile element={{ symbol: count, number: 0, name: "items" }} size="md" tone="hazmat" className="mb-[0.08em]" />
        </h1>

        <div role="group" aria-label="Filter">
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0">
          {INVENTORY_FILTERS.map((f) => {
            const on = filter === f;
            const e = f === "All" ? { symbol: "Al", number: 13, name: "All" } : tileFor(f);
            return (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => setFilter(f)}
                  data-cursor="filter"
                  aria-pressed={on}
                  className="group flex items-center gap-2.5"
                >
                  <ElementTile element={e} size="md" tone={on ? "hazmat" : "outline"} className="transition-transform group-hover:-translate-y-0.5" />
                  <span className="font-mono text-[12px] transition-colors" style={{ color: on ? "var(--color-bone)" : "var(--color-smoke)" }}>
                    {f}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        </div>
      </div>

      <div id="experiments" className="scroll-mt-28" aria-hidden />

      <div onPointerMove={track} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((card, i) => (
            <motion.div
              key={card.key}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05, ease: EASE_OUT }}
              onPointerEnter={() => setHovered(card.key)}
              onPointerLeave={() => setHovered(null)}
            >
              <BatchCard as="h2" card={card} index={i} image={card.image} ratio="16/10" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center font-mono text-sm text-smoke">
          Nothing tagged {filter} yet.{" "}
          <button type="button" onClick={() => setFilter("All")} className="text-hazmat underline underline-offset-4">
            Show all
          </button>
        </p>
      )}

      {/* ── cursor-following preview ─────────────────────────────────── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key={preview.key}
            aria-hidden
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={BOING}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[260px] overflow-hidden rounded-2xl border border-line bg-lab shadow-2xl md:block"
          >
            <Shot
              src={preview.image}
              alt={preview.alt}
              seed={preview.slug}
              symbols={preview.stack ? stackSymbols(preview.stack) : [tileFor(preview.name).symbol]}
              number={String(shown.indexOf(preview) + 1).padStart(2, "0")}
              sizes="260px"
              className="rounded-none"
            />
            <div className="px-4 py-3 font-mono text-[11px] text-smoke">
              {preview.name} · {preview.year}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
