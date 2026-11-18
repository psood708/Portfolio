import type { Metadata } from "next";
import Notebook from "@/components/Notebook";
import PixelPortrait from "@/components/PixelPortrait";
import Principles from "@/components/Principles";
import Reveal from "@/components/Reveal";
import SectionStamp from "@/components/SectionStamp";
import StackTable from "@/components/StackTable";
import { portraitImage } from "@/lib/assets";

export const metadata: Metadata = {
  title: "About",
  description:
    "Applied AI engineer in healthcare — clinical NLP, cohort pipelines, retrieval infrastructure. Previously ISRO and MoMacMo.",
};

export default function AboutPage() {
  const portrait = portraitImage();

  return (
    <>
      <section className="mx-auto max-w-[1280px] px-5 pt-8 md:px-8 md:pt-12">
        <SectionStamp index="01" label="The engineer" className="mb-8 md:mb-12" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[400px_minmax(0,1fr)] md:gap-16">
          <div className="mx-auto w-full max-w-[340px] md:max-w-none">
            <PixelPortrait src={portrait} />
          </div>

          <div className="flex flex-col gap-7 md:gap-9">
            <Reveal kind="wipe">
              <h1
                className="display-condensed m-0 font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
                style={{ fontSize: "var(--text-about)" }}
              >
                Part engineer, part prompt whisperer, full-time tinkerer.
              </h1>
            </Reveal>
            <Reveal>
              <p className="m-0 max-w-[62ch] text-[17px] leading-[1.55] text-bone/85 md:text-[19px]">
                I build applied AI in healthcare — ML pipelines that pull patient cohorts
                out of high-dimensional clinical data, and bio-NLP that reads what the
                structured tables miss: BioBERT over EHR notes, PubMedBERT over
                publications, UMAP and BERTopic to surface prescribing patterns and
                physician referral networks. Before that I moved 10TB+ of mission
                telemetry through PySpark at ISRO’s Space Applications Centre. Off the
                clock I write the layer underneath — a vector index from scratch in Rust,
                a three-tier memory system, agents that earn their evals. I care about
                evals, latency budgets and the unglamorous plumbing that makes AI
                trustworthy.
              </p>
            </Reveal>
            <StackTable />
          </div>
        </div>
      </section>

      {/* ── principles: pinned + stacked ───────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-5 pt-16 md:px-8 md:pt-24">
        <Principles />
      </section>

      {/* ── lab notebook ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-6 md:px-8 md:pb-[72px]">
        <SectionStamp index="02" label="Lab notebook" className="mb-6" />
        <Notebook />
      </section>
    </>
  );
}
