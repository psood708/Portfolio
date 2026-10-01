import type { Metadata } from "next";
import WorkTable from "@/components/WorkTable";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Shipped applied-AI work: RAG copilots, eval harnesses, voice agents and vision models.",
};

export default function WorkPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 md:px-8 md:pb-[72px] md:pt-[72px]">
      <WorkTable />
    </section>
  );
}
