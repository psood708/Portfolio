"use client";

import type { LabEntry, Project } from "@/lib/content";
import { stackSymbols, tileFor } from "@/lib/elements";
import ElementTile from "./ElementTile";
import Shot from "./Shot";

export type CardData = {
  key: string;
  slug: string;
  kind: "batch" | "experiment";
  name: string;
  line: string;
  metric?: string;
  metricLabel?: string;
  stack?: string;
  year: string;
  href: string;
  badge: string;
  badgeTone: "crystal" | "sand";
  filters: string[];
  alt: string;
};

export function toCard(item: Project | LabEntry): CardData {
  if ("tags" in item) {
    return {
      key: `batch-${item.slug}`,
      slug: item.slug,
      kind: "batch",
      name: item.name,
      line: item.line,
      metric: item.metric,
      metricLabel: item.metricLabel,
      stack: item.stack,
      year: item.year,
      href: item.href,
      badge: item.tags[0] ?? "Systems",
      badgeTone: "crystal",
      filters: [...item.tags],
      alt: item.shot,
    };
  }
  return {
    key: `experiment-${item.slug}`,
    slug: item.slug,
    kind: "experiment",
    name: item.name,
    line: item.line,
    year: item.date,
    href: item.href,
    badge: item.status,
    badgeTone: "sand",
    filters: ["Experiments"],
    alt: item.shot,
  };
}

type Props = {
  card: CardData;
  index: number;
  image: string | null;
  ratio?: string;
  sizes?: string;
  className?: string;
};

/**
 * A lab report. Batch number and year on the header line, the shot (or its
 * spectrum plate), the purity readout, then name, one-liner and the stack as
 * tiles. The whole card is one link.
 */
export default function BatchCard({ card, index, image, ratio = "3/4", sizes, className = "" }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const symbols = card.stack ? stackSymbols(card.stack) : [tileFor(card.badge).symbol];
  const label = card.kind === "batch" ? `batch ${num}` : `experiment ${num}`;

  return (
    <a
      href={card.href}
      target="_blank"
      rel="noreferrer"
      data-cursor="open ↗"
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-[24px] border border-line bg-lab p-4 transition-colors duration-300 hover:border-crystal/60 md:p-5 ${className}`}
    >
      <span
        aria-hidden
        className="display-condensed pointer-events-none absolute -right-2 -top-6 font-display text-[120px] font-extrabold leading-none"
        style={{ color: "color-mix(in oklch, var(--color-bone) 4%, transparent)" }}
      >
        {num}
      </span>

      <div className="relative flex items-center justify-between">
        <span className="lab-label text-smoke">{label}</span>
        <span className="lab-label" style={{ color: card.badgeTone === "sand" ? "var(--color-sand)" : "var(--color-crystal)" }}>
          {card.badge}
        </span>
      </div>

      <Shot src={image} alt={card.alt} seed={card.slug} symbols={symbols} number={num} ratio={ratio} sizes={sizes} />

      {card.metric && (
        <div className="relative flex items-baseline gap-3">
          <span
            className="display-condensed font-display text-[40px] font-extrabold leading-none tracking-[-0.03em] text-hazmat md:text-[48px]"
          >
            {card.metric}
          </span>
          <span className="lab-label text-smoke">{card.metricLabel}</span>
        </div>
      )}

      <div className="relative flex flex-col gap-1.5">
        <h3 className="m-0 font-display text-[24px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[28px]">
          {card.name}
        </h3>
        <p className="m-0 text-[15px] leading-[1.45] text-smoke">{card.line}</p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex gap-1.5">
          {symbols.map((s) => (
            <ElementTile key={s} element={tileFor(s)} size="xs" tone="outline" />
          ))}
        </div>
        <span className="font-mono text-[12px] text-smoke">{card.year}</span>
      </div>
    </a>
  );
}
