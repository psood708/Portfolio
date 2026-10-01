"use client";

import { motion } from "framer-motion";
import { LAB } from "@/lib/content";
import { viewportOnce } from "@/lib/motion";
import Hatch from "./Hatch";

/**
 * "Cards drift in on scroll with slight random rotation (−2°…2°) settling to 0."
 * The per-card angle is not random at runtime — the design pins one to each
 * entry (`rot`), so the layout is stable between renders and across SSR.
 * Hover then tips the card the other way, standing in for the GIF preview.
 */
export default function LabGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
      {LAB.map((l, i) => (
        <motion.article
          key={l.name}
          initial={{ opacity: 0, y: 36, rotate: l.rot }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={viewportOnce}
          transition={{
            duration: 0.6,
            delay: (i % 3) * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ rotate: -1.2, y: -6 }}
          data-cursor="play ▶"
          className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 transition-colors duration-300 hover:border-violet"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-mute-3">{l.date}</span>
            <span
              className="rounded-full bg-line px-2.5 py-[5px] font-mono text-[11px]"
              style={{
                color:
                  l.status === "broke it"
                    ? "var(--color-violet)"
                    : "var(--color-lime)",
              }}
            >
              ● {l.status}
            </span>
          </div>

          <Hatch label={l.shot} ratio="4/3" className="rounded-xl" />

          <div>
            <h2 className="m-0 text-2xl font-semibold tracking-[-0.02em]">{l.name}</h2>
            <p className="m-0 mt-1 text-[15px] leading-[1.4] text-mute-1">{l.line}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
