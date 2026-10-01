"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { bioFor } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

/**
 * The temperature control and the bio it rewrites. The design treats them as
 * one unit — drag the slider and the prose changes register across four bands —
 * so they share a component rather than hoisting state up to the page.
 *
 * `min-height` is locked to the design's values (87px desktop / 74px mobile) so
 * nothing below shifts as the bio length changes.
 */
export default function TempSlider() {
  const [temp, setTemp] = useState(0.7);
  const id = useId();
  const bio = bioFor(temp);

  return (
    <div className="flex max-w-[480px] flex-col gap-4 md:gap-[18px]">
      <div className="relative min-h-[74px] md:min-h-[87px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={bio}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="m-0 text-[17px] leading-[1.45] text-mute-1 md:text-xl"
          >
            {bio}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 rounded-[14px] border border-line-2 bg-surface-2 px-[14px] py-3 md:gap-[14px] md:px-4">
        <label
          htmlFor={id}
          className="flex-none font-mono text-[11px] text-mute-2 md:text-xs"
        >
          <span className="md:hidden">temp</span>
          <span className="hidden md:inline">temperature</span>
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
          data-cursor="drag"
          aria-label="Sampling temperature"
          aria-valuetext={`temperature ${temp.toFixed(1)}`}
          className="temp-range h-11 flex-1 cursor-grab active:cursor-grabbing md:h-3"
        />
        <span className="w-[30px] text-right font-mono text-xs text-lime md:text-[13px]">
          {temp.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
