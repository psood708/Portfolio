"use client";

import { motion } from "framer-motion";
import { SITE, STACK } from "@/lib/content";
import { tileFor } from "@/lib/elements";
import { EASE_OUT } from "@/lib/motion";
import Headline from "./Headline";
import SectionStamp from "./SectionStamp";
import Smoke from "./Smoke";
import TileField from "./TileField";
import TitleCard from "./TitleCard";

const SYMBOLS = STACK.map((s) => tileFor(s).symbol);

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Smoke />

      {/* the desert horizon: a hairline at 78% the smoke rises from */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 h-px origin-left bg-line"
        style={{ top: "78%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE_OUT }}
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 pb-16 pt-8 md:grid-cols-[minmax(0,1fr)_380px] md:items-start md:gap-12 md:px-8 md:pb-24 md:pt-14 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="flex flex-col items-start gap-8 md:gap-10">
          <SectionStamp index="00" label="The lab" className="w-full" />

          <TitleCard />

          <div className="flex max-w-[640px] flex-col gap-5">
            <Headline />
            <p className="lab-label m-0 flex items-center gap-2 text-smoke">
              {SITE.roleLine}
              <span className="caret-blink inline-block h-[11px] w-[6px] bg-crystal" />
            </p>
          </div>
        </div>

        <div className="md:pt-16">
          <TileField symbols={SYMBOLS} />
        </div>
      </div>

      <motion.p
        className="lab-label absolute bottom-5 left-5 m-0 hidden text-smoke md:left-8 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        scroll ↓
      </motion.p>
    </section>
  );
}
