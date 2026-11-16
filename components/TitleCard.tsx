"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { NAME_TILES } from "@/lib/elements";
import { BOING, EASE_OUT } from "@/lib/motion";
import ElementTile from "./ElementTile";
import { useIntro } from "./IntroProvider";

const GLIDE = { type: "spring", stiffness: 170, damping: 26, mass: 1 } as const;

/**
 * The hero *is* the title card: `[P][Ar][Th]` over `[S]ood`. While the intro
 * is undecided or still playing, invisible sizers hold the space so nothing
 * below shifts. When it finishes, tiles that share the preloader's
 * `layoutId`s glide into place; on a return visit they pop in instead.
 */
export default function TitleCard() {
  const { phase, played } = useIntro();
  const [shimmer, setShimmer] = useState(0);
  const ready = phase === "done";

  const tile = (symbol: string, i: number) => {
    const e = NAME_TILES.find((t) => t.symbol === symbol)!;
    if (!ready) {
      return <div key={symbol} aria-hidden style={{ width: "var(--tile)", height: "var(--tile)" }} />;
    }
    return (
      <motion.div
        key={symbol}
        layout={played}
        layoutId={played ? `tile-${symbol}` : undefined}
        transition={played ? { layout: GLIDE } : { ...BOING, delay: i * 0.09 }}
        initial={played ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setShimmer((n) => n + 1)}
        data-cursor="element"
        className="relative"
      >
        <ElementTile element={e} size="xl" flip />
      </motion.div>
    );
  };

  return (
    <h1 className="relative m-0 -mx-3 inline-flex flex-col gap-[clamp(6px,0.6vw,10px)] overflow-hidden px-3 pb-2">
      <span className="sr-only">Parth Sood</span>
      <div aria-hidden className="flex gap-[clamp(6px,0.6vw,10px)]">
        {["P", "Ar", "Th"].map(tile)}
      </div>
      <div aria-hidden className="flex items-end gap-[clamp(6px,0.6vw,10px)]">
        {tile("S", 3)}
        <motion.span
          className="display-condensed pb-[0.04em] font-display font-extrabold leading-none tracking-[-0.03em]"
          style={{ fontSize: "calc(var(--tile) * 0.78)" }}
          initial={ready ? { opacity: 0, x: -12 } : false}
          animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -12 }}
          transition={{ duration: 0.4, delay: played ? 0.3 : 0.4, ease: EASE_OUT }}
        >
          ood
        </motion.span>
      </div>

      {/* a crystal shimmer sweeps the card when any tile is clicked */}
      <AnimatePresence>
        {shimmer > 0 && (
          <motion.span
            key={shimmer}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, transparent 35%, color-mix(in oklch, var(--color-crystal) 55%, transparent) 50%, transparent 65%)",
              mixBlendMode: "screen",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          />
        )}
      </AnimatePresence>
    </h1>
  );
}
