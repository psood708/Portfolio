"use client";

import { motion } from "framer-motion";
import { TIMELINE } from "@/lib/content";
import { cascade, clipUp, viewportOnce } from "@/lib/motion";

/** The career as a lab notebook: dates stamped in the margin, entries on ruled paper. */
export default function Notebook() {
  return (
    <motion.ol
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: "some" }}
      variants={cascade(0.1)}
      className="notebook-rules m-0 list-none border-t border-line p-0"
    >
      {TIMELINE.map((t) => (
        <motion.li
          key={t.where}
          variants={clipUp}
          className="grid grid-cols-1 gap-1 border-b border-line py-5 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1.2fr)] md:items-baseline md:gap-6"
          style={{ lineHeight: "32px" }}
        >
          <span className="lab-label text-hazmat">{t.when}</span>
          <span className="font-display text-[22px] font-semibold tracking-[-0.01em] md:text-[26px]">{t.where}</span>
          <span className="text-[15px] text-smoke md:text-base">{t.what}</span>
        </motion.li>
      ))}
    </motion.ol>
  );
}
