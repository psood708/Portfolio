import Link from "next/link";
import AskBar from "@/components/AskBar";
import Batches from "@/components/Batches";
import CautionBand from "@/components/CautionBand";
import Hero from "@/components/Hero";
import Readouts from "@/components/Readouts";
import Reveal from "@/components/Reveal";
import RvPanel from "@/components/RvPanel";
import SectionStamp from "@/components/SectionStamp";
import { projectImage } from "@/lib/assets";
import { toCard } from "@/lib/cards";
import { FEATURED, LAB } from "@/lib/content";

export default function Home() {
  const cards = FEATURED.map((p) => ({ ...toCard(p), image: projectImage(p.slug) }));

  return (
    <>
      <Hero />

      <Readouts />

      <section className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
        <AskBar />
      </section>

      <CautionBand />

      {/* ── batches ────────────────────────────────────────────────────── */}
      <section className="pt-10 md:pt-16">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <SectionStamp index="03" label="Batches" className="mb-6" />
          <Reveal kind="wipe" className="mb-6 flex items-end justify-between gap-4 md:mb-10">
            <h2
              className="display-condensed m-0 font-display font-extrabold leading-[0.9] tracking-[-0.03em]"
              style={{ fontSize: "var(--text-section)" }}
            >
              Batches
            </h2>
            <Link
              href="/work"
              data-cursor="all batches"
              className="flex-none font-mono text-[13px] text-smoke transition-colors hover:text-hazmat"
            >
              all batches ↗
            </Link>
          </Reveal>
        </div>
        <Batches cards={cards} />
      </section>

      {/* ── experiments ────────────────────────────────────────────────── */}
      <section className="mx-auto mt-8 max-w-[1280px] px-5 pb-4 md:mt-16 md:px-8">
        <RvPanel entries={LAB.map((l) => ({ name: l.name, slug: l.slug, status: l.status }))} />
      </section>
    </>
  );
}
