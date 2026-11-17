"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BatchCard, { type CardData } from "./BatchCard";

type Props = { cards: (CardData & { image: string | null })[] };

/**
 * On a desktop with a fine pointer the four featured batches ride a pinned
 * track: the section is 300vh tall, the viewport sticks, and scroll
 * translates the cards sideways under a `BATCH 02 / 04` readout. Phones,
 * touch screens and reduced motion get a plain vertical list.
 */
export default function Batches({ cards }: Props) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!pinned) {
    return (
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 px-5 sm:grid-cols-2 md:px-8">
        {cards.map((c, i) => (
          <BatchCard key={c.key} card={c} index={i} image={c.image} ratio="4/3" sizes="(max-width: 640px) 100vw, 50vw" />
        ))}
      </div>
    );
  }

  return <PinnedTrack cards={cards} />;
}

function PinnedTrack({ cards }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const n = cards.length;

  useMotionValueEvent(scrollYProgress, "change", (p) => setCurrent(Math.round(p * (n - 1))));

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const pad = 32;
      setTravel(Math.max(0, el.scrollWidth - window.innerWidth + pad));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [n]);

  return (
    <div ref={outer} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-5 pl-5 pr-8 md:pl-8">
          {cards.map((c, i) => (
            <div key={c.key} className="w-[clamp(300px,34vw,460px)]">
              <BatchCard card={c} index={i} image={c.image} className="h-full" sizes="460px" />
            </div>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute bottom-8 left-5 right-5 flex items-center gap-4 md:left-8 md:right-8">
          <span className="lab-label text-smoke">
            batch {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-line">
            <motion.div className="h-full origin-left bg-hazmat" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  );
}
