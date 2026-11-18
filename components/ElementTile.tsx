"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { CSSProperties } from "react";
import type { Element } from "@/lib/elements";
import { BOING } from "@/lib/motion";

export type TileSize = "xs" | "md" | "xl";
export type TileTone = "element" | "hazmat" | "sand" | "crystal" | "outline";

type Props = Omit<HTMLMotionProps<"div">, "children"> & {
  element: Element;
  size?: TileSize;
  tone?: TileTone;
  /** Hover flips the tile to show the element's full name. */
  flip?: boolean;
  layoutId?: string;
};

const EDGE: Record<TileSize, string> = {
  xs: "28px",
  md: "44px",
  xl: "var(--tile)",
};

const TONE: Record<TileTone, CSSProperties> = {
  element: {
    background: "var(--color-element)",
    color: "var(--color-bone)",
    borderColor: "var(--color-bone)",
  },
  hazmat: {
    background: "var(--color-hazmat)",
    color: "var(--color-tar)",
    borderColor: "var(--color-tar)",
  },
  sand: {
    background: "var(--color-sand)",
    color: "var(--color-tar)",
    borderColor: "var(--color-tar)",
  },
  crystal: {
    background: "var(--color-crystal)",
    color: "var(--color-tar)",
    borderColor: "var(--color-tar)",
  },
  outline: {
    background: "transparent",
    color: "var(--color-bone)",
    borderColor: "color-mix(in oklch, var(--color-bone) 40%, transparent)",
  },
};

/**
 * The signature component: a periodic-table tile. Everything inside is sized
 * in `em` against `--edge`, so one markup serves the nav logo, the filter
 * chips and the poster-scale title card.
 */
export default function ElementTile({
  element,
  size = "md",
  tone = "element",
  flip = false,
  layoutId,
  className = "",
  style,
  ...rest
}: Props) {
  const edge = EDGE[size];
  // No position utility here: the front is `relative`, the back `absolute`, and
  // mixing both on one element lets stylesheet order decide (it chose wrong).
  const face = `flex h-full w-full flex-col justify-between border-[0.02em] p-[0.08em] [backface-visibility:hidden] ${
    size === "xl" ? "border-2" : ""
  }`;
  const number = element.number > 0 ? String(element.number) : "";

  const front = (
    <div className={`relative ${face}`} style={TONE[tone]}>
      {size !== "xs" && (
        <span className="font-mono text-[0.14em] leading-none tracking-tight">
          {number || " "}
        </span>
      )}
      <span
        className="absolute inset-0 flex items-center justify-center font-display text-[0.5em] font-medium leading-none"
        style={{ fontVariationSettings: '"wdth" 100' }}
      >
        {element.symbol}
      </span>
      {size === "xl" && (
        <span className="self-center font-display text-[0.075em] font-medium leading-none tracking-[0.02em]">
          {element.name}
        </span>
      )}
    </div>
  );

  if (!flip) {
    return (
      <motion.div
        layoutId={layoutId}
        className={`shrink-0 select-none ${className}`}
        style={{ width: edge, height: edge, fontSize: edge, ...style }}
        {...rest}
      >
        {front}
      </motion.div>
    );
  }

  const back = (
    <div
      className={`${face} absolute inset-0 items-start [transform:rotateY(180deg)]`}
      style={TONE[tone]}
    >
      <span className="font-mono text-[0.14em] leading-none">{number || "—"}</span>
      <span className="font-display text-[0.13em] font-semibold leading-[1.05] tracking-[-0.01em]">
        {element.name}
      </span>
    </div>
  );

  // Hover is tracked on the outer box, which never rotates; the inner card
  // follows by variant. Hovering the rotating card itself made the edges
  // slip out from under the cursor mid-flip and the tile flap back and forth.
  return (
    <motion.div
      layoutId={layoutId}
      className={`shrink-0 select-none ${className}`}
      style={{ width: edge, height: edge, fontSize: edge, perspective: "900px", ...style }}
      initial="rest"
      animate="rest"
      whileHover="flipped"
      {...rest}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        variants={{ rest: { rotateY: 0 }, flipped: { rotateY: 180 } }}
        transition={{ ...BOING, stiffness: 260, damping: 22 }}
      >
        {front}
        {back}
      </motion.div>
    </motion.div>
  );
}
