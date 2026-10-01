import type { Metadata } from "next";
import LabGrid from "@/components/LabGrid";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Weekend experiments and half-baked prototypes. Some shipped, some exploded.",
};

export default function LabPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 md:px-8 md:pb-[72px] md:pt-[72px]">
      <Reveal className="grid grid-cols-1 items-end gap-6 pb-10 md:grid-cols-[minmax(0,1fr)_380px] md:gap-12 md:pb-12">
        <h1 className="m-0 text-page font-extrabold leading-[0.85] tracking-[-0.05em]">
          The <span className="text-violet">lab</span>.
        </h1>
        <p className="m-0 text-[17px] leading-[1.45] text-mute-1 md:text-lg">
          Things I built because I couldn’t stop thinking about them. Some shipped.
          Some exploded. All taught me something.
        </p>
      </Reveal>

      <LabGrid />
    </section>
  );
}
