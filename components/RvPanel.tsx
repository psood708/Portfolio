"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RV_COPY } from "@/lib/content";
import { tileFor } from "@/lib/elements";
import ElementTile from "./ElementTile";
import Magnetic from "./Magnetic";
import SectionStamp from "./SectionStamp";
import TransitionLink from "./TransitionLink";

type Props = { entries: { name: string; slug: string; status: string }[] };

/**
 * The sand panel. Scales 0.9 → 1 and rounds 48 → 24px as it scrolls into
 * view, so the easing is tied to the wheel rather than a one-shot reveal.
 */
export default function RvPanel({ entries }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.45"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 24]);

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        style={{ scale, borderRadius: radius }}
        className="relative grid grid-cols-1 gap-8 overflow-hidden bg-sand p-7 text-tar md:grid-cols-[1.2fr_1fr] md:gap-12 md:p-14"
      >
        <div className="flex flex-col items-start gap-6">
          <SectionStamp index="04" label="Experiments" tone="tar" className="w-full" />
          <h2
            className="display-condensed m-0 font-display font-extrabold leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize: "var(--text-panel)" }}
          >
            {RV_COPY.title}
            <br />
            <span style={{ color: "color-mix(in oklch, var(--color-tar) 55%, transparent)" }}>{RV_COPY.sub}</span>
          </h2>
          <Magnetic>
            <TransitionLink
              href="/work#experiments"
              data-cursor="open"
              className="block rounded-full bg-tar px-6 py-3.5 text-[15px] font-semibold text-bone transition-colors duration-200 hover:bg-hazmat hover:text-tar"
            >
              {RV_COPY.cta}
            </TransitionLink>
          </Magnetic>
        </div>

        <ul className="m-0 flex list-none flex-col p-0">
          {entries.map((e) => {
            const el = tileFor(e.name);
            return (
              <li
                key={e.slug}
                className="flex items-center gap-4 border-t py-3.5 first:border-t-0 md:py-4"
                style={{ borderColor: "color-mix(in oklch, var(--color-tar) 18%, transparent)" }}
              >
                <ElementTile element={el} size="md" tone="outline" style={{ color: "var(--color-tar)" }} className="[&>div]:!border-tar/60 [&>div]:!text-tar" />
                <span className="flex-1 text-[17px] font-semibold tracking-[-0.01em] md:text-[19px]">{e.name}</span>
                <span className="lab-label" style={{ color: "color-mix(in oklch, var(--color-tar) 60%, transparent)" }}>{e.status}</span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
