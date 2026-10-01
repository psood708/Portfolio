"use client";

import { MARQUEE } from "@/lib/content";

/**
 * The capability ticker. The design draws it as a clipped static row; here it
 * scrolls, with the list duplicated so the -50% keyframe loops seamlessly.
 * Hovering pauses it, which makes the lime/violet ✦ rhythm readable.
 */
export default function Marquee() {
  const run = [...MARQUEE, ...MARQUEE];

  return (
    <div className="marquee-shell overflow-hidden border-y border-line py-[14px] md:py-[18px]">
      <div
        className="marquee-track flex w-max gap-5 pr-5 md:gap-9 md:pr-9"
        style={{ "--marquee-duration": "34s" } as React.CSSProperties}
        aria-hidden
      >
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-5 md:gap-9">
            <span className="whitespace-nowrap text-xl font-semibold text-mute-3 md:text-[28px]">
              {item}
            </span>
            <span
              className="text-xl md:text-[28px]"
              style={{
                color: i % 2 === 0 ? "var(--color-violet)" : "var(--color-lime)",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
      {/* Screen readers get the list once, in order, without the duplication. */}
      <p className="sr-only">Capabilities: {MARQUEE.join(", ")}.</p>
    </div>
  );
}
