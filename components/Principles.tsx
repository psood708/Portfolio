"use client";

import { motion } from "framer-motion";
import { PRINCIPLES } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

/**
 * Three principle cards pinned and stacked: each sticks 20px lower than the
 * one before and slides over it as it arrives. The tall bottom margins supply
 * the scroll travel. Below `md` they are a plain column.
 */
export default function Principles() {
  return (
    <div className="relative md:pb-[30vh]">
      {PRINCIPLES.map((p, i) => (
        <motion.div
          key={p.index}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-4 md:sticky md:mb-[42vh]"
          style={{ top: `${104 + i * 20}px`, zIndex: i + 1 }}
        >
          <article
            className="flex flex-col gap-4 rounded-[24px] p-7 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] md:p-10"
            style={{ background: p.bg, color: p.fg }}
          >
            <span className="lab-label">{p.index}</span>
            <h2
              className="display-condensed m-0 font-display text-[32px] font-extrabold leading-none tracking-[-0.02em] md:text-[48px]"
            >
              {p.title}
            </h2>
            <p className="m-0 max-w-[48ch] text-base leading-[1.45] md:text-lg">{p.body}</p>
          </article>
        </motion.div>
      ))}
    </div>
  );
}
