"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useVelocity,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MARQUEE } from "@/lib/content";

const BASE_SPEED = 60; // px per second
const K = 0.004;

function Band({ items, direction, tilt }: { items: readonly string[]; direction: 1 | -1; tilt: number }) {
  const x = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCalm(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useAnimationFrame((_, delta) => {
    if (calm) return;
    const half = (ref.current?.scrollWidth ?? 0) / 2;
    if (!half) return;
    const v = Math.max(-2000, Math.min(2000, velocity.get()));
    const speed = (BASE_SPEED + Math.abs(v) * K * 60) * (delta / 1000);
    let next = x.get() - speed * direction;
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  const run = [...items, ...items];

  return (
    <div
      className="caution-stripes w-[120vw] py-[2px]"
      style={{ transform: `translateX(-10vw) rotate(${tilt}deg)` }}
    >
      <div className="overflow-hidden bg-hazmat py-2 md:py-3">
        <motion.div ref={ref} style={{ x }} className="flex w-max" aria-hidden>
          {run.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center">
              <span
                className="display-condensed whitespace-nowrap px-5 font-display font-extrabold uppercase leading-none text-tar md:px-8"
                style={{ fontSize: "clamp(26px, 3.6vw, 52px)", letterSpacing: "-0.01em" }}
              >
                {item}
              </span>
              <span className="text-tar" style={{ fontSize: "clamp(18px, 2.2vw, 30px)" }}>
                ⚠
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Hazmat tape. Two bands, tilted against each other, drifting opposite ways.
 * Scroll velocity speeds them up; reduced motion holds them still.
 */
export default function CautionBand() {
  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      <Band items={MARQUEE} direction={1} tilt={-2} />
      <div className="-mt-3 md:-mt-5">
        <Band items={[...MARQUEE].reverse()} direction={-1} tilt={1.5} />
      </div>
      <p className="sr-only">Capabilities: {MARQUEE.join(", ")}.</p>
    </div>
  );
}
