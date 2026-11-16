import Link from "next/link";
import AskBar from "@/components/AskBar";
import Hero from "@/components/Hero";
import FeaturedGrid from "@/components/FeaturedGrid";
import LabPanel from "@/components/LabPanel";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-[1280px] px-5 pb-10 md:px-8">
        <AskBar />
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
