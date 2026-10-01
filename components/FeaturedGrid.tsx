"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FEATURED } from "@/lib/content";
import { cascade, revealVariants, viewportOnce } from "@/lib/motion";
import Hatch from "./Hatch";

/**
 * "Shipped stuff" cards. Hover lifts the card 4px, turns the border lime and
 * scales the shot 1.04 — all three from the design's annotation.
 */
export default function FeaturedGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
      variants={cascade(0.09)}
      className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
    >
      {FEATURED.map((p) => (
        <motion.div key={p.slug} variants={revealVariants}>
          <Link
            href={`/work#${p.slug}`}
            data-cursor="open ↗"
            className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-lime md:rounded-[20px]"
          >
            <div className="overflow-hidden">
              <Hatch
                label={p.shot}
                className="transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-end justify-between gap-3 p-4 md:gap-4 md:px-6 md:py-[22px]">
              <div className="min-w-0">
                <div className="text-[22px] font-semibold tracking-[-0.02em] md:text-[30px]">
                  {p.name}
                </div>
                <div className="mt-1 text-sm text-mute-1 md:text-[15px]">{p.line}</div>
              </div>
              <div className="flex-none text-right">
                <div className="text-xl font-extrabold tracking-[-0.03em] text-lime md:text-[30px]">
                  {p.metric}
                </div>
                <div className="hidden font-mono text-[11px] text-mute-2 md:block">
                  {p.metricLabel}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
