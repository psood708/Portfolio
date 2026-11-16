"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PROJECTS, LAB } from "@/lib/content";
import { BOING, EASE_OUT, viewportOnce } from "@/lib/motion";
import Hatch from "./Hatch";

/* ── unified filter set ────────────────────────────────────────────────── */
const FILTERS = ["All", "Agents", "RAG", "Evals", "Systems", "Experiments"] as const;
type UFilter = (typeof FILTERS)[number];

/* ── normalise both data shapes into one card shape ───────────────────── */
type Card = {
  key: string;
  name: string;
  line: string;
  badge: string;
  badgeKind: "tag" | "status";
  year: string;
  shot: string;
  img?: string;
  href: string;
  rot: number;
  filters: string[];
};

const projectCards: Card[] = PROJECTS.map((p) => ({
  key: `project-${p.slug}`,
  name: p.name,
  line: p.line,
  badge: p.tags[0] ?? "Systems",
  badgeKind: "tag",
  year: p.year,
  shot: p.shot,
  img: p.img,
  href: p.href,
  rot: 0,
  filters: p.tags,
}));

const labCards: Card[] = LAB.map((l, i) => ({
  key: `lab-${l.name}`,
  name: l.name,
  line: l.line,
  badge: l.status,
  badgeKind: "status",
  year: l.date,
  shot: l.shot,
  img: l.img,
  href: l.href,
  rot: l.rot,
  filters: ["Experiments"],
}));

const ALL_CARDS: Card[] = [...projectCards, ...labCards];

function badgeColor(card: Card) {
  if (card.badgeKind === "status" && card.badge === "broke it")
    return "var(--color-violet)";
  if (card.badgeKind === "status") return "var(--color-lime)";
  // tag colours
  const map: Record<string, string> = {
    Agents: "var(--color-lime)",
    RAG: "var(--color-lime)",
    Evals: "var(--color-violet)",
    Systems: "var(--color-bone)",
  };
  return map[card.badge] ?? "var(--color-mute-1)";
}

export default function UnifiedGrid() {
  const [filter, setFilter] = useState<UFilter>("All");

  const shown =
    filter === "All" ? ALL_CARDS : ALL_CARDS.filter((c) => c.filters.includes(filter));
  const count = String(shown.length).padStart(2, "0");

  return (
    <>
      {/* ── heading + filters ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:pb-12">
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

      {/* ── grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        <AnimatePresence mode="popLayout">
          {shown.map((card, i) => (
            <motion.a
              key={card.key}
              layout
              href={card.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="open ↗"
              initial={{ opacity: 0, y: 36, rotate: card.rot }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={viewportOnce}
              transition={{
                duration: 0.55,
                delay: (i % 3) * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ rotate: -1.2, y: -6, transition: BOING }}
              className="group flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 transition-colors duration-300 hover:border-lime"
            >
              {/* ── header row ─────────────────────────────────────────── */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-mute-3">{card.year}</span>
                <span
                  className="rounded-full bg-line px-2.5 py-[5px] font-mono text-[11px]"
                  style={{ color: badgeColor(card) }}
                >
                  ● {card.badge}
                </span>
              </div>

              {/* ── image / hatch ──────────────────────────────────────── */}
              {card.img ? (
                <div
                  className="relative w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio: "16/10" }}
                >
                  <Image
                    src={card.img}
                    alt={card.shot}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <Hatch label={card.shot} ratio="16/10" className="rounded-xl" />
              )}

              {/* ── text ───────────────────────────────────────────────── */}
              <div>
                <h2 className="m-0 text-2xl font-semibold tracking-[-0.02em]">
                  {card.name}
                </h2>
                <p className="m-0 mt-1 text-[15px] leading-[1.4] text-mute-1">
                  {card.line}
                </p>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center font-mono text-sm text-mute-3">
          Nothing tagged {filter} yet.{" "}
          <button
            type="button"
            onClick={() => setFilter("All")}
            className="text-lime underline underline-offset-4"
          >
            Show all
          </button>
        </p>
      )}
    </>
  );
}
