import type { Metadata } from "next";
import UnifiedGrid from "@/components/UnifiedGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Shipped applied-AI work and experiments: RAG pipelines, eval harnesses, agent systems, vector search and more.",
};

export default function WorkPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 md:px-8 md:pb-[72px] md:pt-[72px]">
      <UnifiedGrid />
    </section>
  );
}
