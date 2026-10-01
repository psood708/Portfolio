"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * "Bold scroll: panel scales .85 → 1 and rounds 48 → 24px while scrolling into
 * view." Driven off scroll progress rather than a one-shot reveal, so the
 * easing is tied to the wheel.
 */
export default function LabPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 24]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, borderRadius: radius }}
      className="relative grid grid-cols-1 items-center gap-6 bg-violet p-7 text-ink md:grid-cols-2 md:gap-12 md:p-14"
    >
      <div className="text-panel font-extrabold leading-[0.95] tracking-[-0.03em] md:leading-[0.92] md:tracking-[-0.04em]">
        Half my ideas break.
        <br className="hidden md:block" />{" "}
        <span className="md:hidden"> </span>The lab is where they live.
      </div>
      <div className="flex flex-col items-start gap-[18px] md:gap-5">
        <span className="hidden text-lg leading-[1.45] md:block">
          Weekend experiments, half-baked prototypes and the occasional thing that
          went viral on a Tuesday.
        </span>
        <Link
          href="/lab"
          data-cursor="enter →"
          className="rounded-full bg-ink px-5 py-[13px] text-sm font-semibold text-bone transition-transform duration-200 ease-boing hover:scale-105 md:px-6 md:py-3.5 md:text-[15px]"
        >
          Enter the lab →
        </Link>
      </div>
    </motion.div>
  );
}
