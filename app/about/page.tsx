import type { Metadata } from "next";
import AboutPrinciples from "@/components/AboutPrinciples";
import Portrait from "@/components/Portrait";
import Reveal from "@/components/Reveal";
import { STACK, TIMELINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Part engineer, part prompt whisperer, full-time tinkerer. Evals, latency budgets and the unglamorous plumbing that makes AI trustworthy.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 py-10 md:grid-cols-[420px_minmax(0,1fr)] md:gap-14 md:px-8 md:py-[72px]">
        <Reveal className="mx-auto w-full max-w-[320px] md:max-w-none">
          <Portrait />
        </Reveal>

        <div className="flex flex-col gap-7 md:gap-8">
          <h1 className="m-0 text-about font-extrabold leading-[0.95] tracking-[-0.04em]">
            Part engineer, part <span className="text-lime">prompt whisperer</span>,
            full-time tinkerer.
          </h1>
          <p className="m-0 max-w-[640px] text-[17px] leading-[1.55] text-mute-1 md:text-[19px]">
            I sit between research and product: taking what models can do this month
            and turning it into features people rely on. I care about evals, latency
            budgets and the unglamorous plumbing that makes AI trustworthy.
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {STACK.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line-2 px-3.5 py-2 font-mono text-[13px] transition-[transform,background,color] duration-250 ease-boing hover:-translate-y-[3px] hover:-rotate-3 hover:bg-lime hover:text-ink"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── principles: pinned + stacked ───────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-5 md:px-8">
        <AboutPrinciples />
      </section>

      {/* ── git log --career ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 md:px-8 md:pb-[72px] md:pt-10">
        <h2 className="m-0 mb-2 font-mono text-xs font-normal text-mute-3">
          git log --career
        </h2>
        {TIMELINE.map((t) => (
          <Reveal
            key={t.where}
            className="grid grid-cols-1 gap-1.5 border-b border-line py-5 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:gap-6 md:py-[22px]"
          >
            <span className="font-mono text-[13px] text-lime">{t.when}</span>
            <span className="text-[22px] font-semibold md:text-[26px]">{t.where}</span>
            <span className="text-base text-mute-1">{t.what}</span>
          </Reveal>
        ))}
      </section>
    </>
  );
}
