"use client";

import { motion } from "framer-motion";
import { STACK } from "@/lib/content";
import { tileFor } from "@/lib/elements";
import { BOING, cascade, viewportOnce } from "@/lib/motion";
import ElementTile from "./ElementTile";

const pop = {
  hidden: { opacity: 0, scale: 0.7 },
  shown: { opacity: 1, scale: 1, transition: BOING },
};

/** The stack as a fragment of the periodic table: two rows, the second stepped in by one. */
export default function StackTable() {
  const half = Math.ceil(STACK.length / 2);
  return (
    <motion.ul
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
      variants={cascade(0.05)}
      className="m-0 grid list-none grid-cols-[repeat(7,44px)] gap-1.5 p-0"
      aria-label="Stack"
    >
      {STACK.map((s, i) => {
        const e = tileFor(s);
        return (
          <motion.li
            key={s}
            variants={pop}
            className="group relative"
            style={i === half ? { gridColumnStart: 2 } : undefined}
            whileHover={{ y: -4 }}
          >
            <ElementTile element={e} size="md" tone={i % 5 === 0 ? "element" : "outline"} />
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-bone px-1.5 py-0.5 font-mono text-[10px] text-tar opacity-0 transition-opacity group-hover:opacity-100">
              {e.name}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
