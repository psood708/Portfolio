import type { Metadata } from "next";
import Inventory from "@/components/Inventory";
import SectionStamp from "@/components/SectionStamp";
import { labImage, projectImage } from "@/lib/assets";
import { LAB, PROJECTS } from "@/lib/content";
import { buildInventory } from "@/lib/inventory";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Every batch and experiment: RAG pipelines, eval harnesses, agent systems, vector search and more.",
};

export default function WorkPage() {
  const cards = buildInventory(PROJECTS, LAB).map((c) => ({
    ...c,
    image: c.kind === "experiment" ? labImage(c.slug) : projectImage(c.slug),
  }));

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-8 md:px-8 md:pb-[72px] md:pt-12">
      <SectionStamp index="03" label="Inventory" className="mb-8" />
      <Inventory cards={cards} />
    </section>
  );
}
