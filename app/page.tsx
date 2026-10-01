import Link from "next/link";
import AskBar from "@/components/AskBar";
import FeaturedGrid from "@/components/FeaturedGrid";
import Headline from "@/components/Headline";
import LabPanel from "@/components/LabPanel";
import Marquee from "@/components/Marquee";
import ModelToys from "@/components/ModelToys";
import Reveal from "@/components/Reveal";
import SectionNote from "@/components/SectionNote";
import TempSlider from "@/components/TempSlider";
import { SITE } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* ── hero ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-5 pb-8 pt-10 md:px-8 md:pb-12 md:pt-[88px]">
        <p className="m-0 mb-[18px] font-mono text-xs text-mute-2 md:mb-7 md:text-sm">
          <span className="text-lime">$</span> whoami → {SITE.role}{" "}
          <span className="caret-blink inline-block h-[17px] w-[9px] translate-y-[3px] bg-lime align-baseline" />
        </p>

        <Headline />

        <div className="mt-8 hidden md:block">
          <SectionNote>
            The green word rerolls every 2s — five variants. Click to skip ahead.
          </SectionNote>
        </div>

        <div className="mt-8 grid grid-cols-1 items-end gap-8 md:mt-12 md:grid-cols-[minmax(0,1fr)_520px] md:gap-12">
          <TempSlider />
          <AskBar />
        </div>

        <div className="mt-10 md:mt-12">
          <ModelToys />
        </div>
      </section>

      <Marquee />

      {/* ── shipped stuff ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-5 pb-8 pt-10 md:px-8 md:pb-8 md:pt-[72px]">
        <Reveal className="mb-4 flex items-end justify-between gap-4 md:mb-8">
          <h2 className="m-0 text-section font-extrabold leading-[0.95] tracking-[-0.04em]">
            Shipped stuff
          </h2>
          <Link
            href="/work"
            data-cursor="all work"
            className="hidden flex-none font-mono text-[13px] text-mute-2 transition-colors hover:text-lime md:block"
          >
            all work →
          </Link>
        </Reveal>

        <FeaturedGrid />

        <Link
          href="/work"
          className="mt-6 inline-block font-mono text-xs text-mute-2 md:hidden"
        >
          all work →
        </Link>
      </section>

      {/* ── lab teaser ─────────────────────────────────────────────────── */}
      <section className="mx-auto mt-8 max-w-[1280px] px-5 md:mt-16 md:px-8">
        <LabPanel />
      </section>
    </>
  );
}
