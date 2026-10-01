"use client";

import { motion } from "framer-motion";
import { PRINCIPLES } from "@/lib/content";
import { viewportOnce } from "@/lib/motion";

/**
 * "Bold scroll: 3 principle cards pinned + stacked, each slides up over the
 * last (sticky section)."
 *
 * All three cards are siblings of one containing block, so they share a sticky
 * context: each pins 20px lower than the one before and covers it as it arrives.
 * The tall bottom margins supply the scroll travel between pins. Below `md` the
 * stack collapses to a plain column — pinning on a phone just hides content.
 */
export default function AboutPrinciples() {
  return (
    <div className="relative md:pb-[30vh]">
      {PRINCIPLES.map((p, i) => (
        <motion.div
          key={p.index}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 md:sticky md:mb-[42vh]"
          style={{ top: `${104 + i * 20}px`, zIndex: i + 1 }}
        >
          <article
            className="flex flex-col gap-3.5 rounded-[20px] p-7 text-ink shadow-[0_-8px_40px_rgba(0,0,0,0.45)] md:p-10"
            style={{ background: p.bg }}
          >
            <span className="font-mono text-[13px] opacity-70">{p.index}</span>
            <h3 className="m-0 text-[28px] font-extrabold leading-none tracking-[-0.02em] md:text-[40px]">
              {p.title}
            </h3>
            <p className="m-0 text-base leading-[1.45] md:text-lg">{p.body}</p>
          </article>
        </motion.div>
      ))}
    </div>
  );
}
