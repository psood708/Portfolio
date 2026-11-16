"use client";

import { motion } from "framer-motion";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

type Props = {
  index: string;
  label: string;
  tone?: "bone" | "tar";
  className?: string;
};

/** The lab-notebook stamp that opens each scene: `§ 03 · BATCHES` and a drawn hairline. */
export default function SectionStamp({ index, label, tone = "bone", className = "" }: Props) {
  const color = tone === "tar" ? "var(--color-tar)" : "var(--color-smoke)";
  const line =
    tone === "tar"
      ? "color-mix(in oklch, var(--color-tar) 30%, transparent)"
      : "var(--color-line)";
  return (
    <div className={`flex items-center gap-4 ${className}`} style={{ color }}>
      <span className="lab-label whitespace-nowrap">
        § {index} · {label}
      </span>
      <motion.span
        aria-hidden
        className="h-px flex-1 origin-left"
        style={{ background: line }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1, ease: EASE_OUT }}
      />
    </div>
  );
}
