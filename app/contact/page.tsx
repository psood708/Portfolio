import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SectionStamp from "@/components/SectionStamp";
import Smoke from "@/components/Smoke";
import { LINKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Say my name",
  description:
    "Open to applied AI roles, freelance builds and nerdy conversations about evals. Replies within 48h.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <Smoke intensity={0.6} />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 pb-20 pt-8 md:grid-cols-[minmax(0,1fr)_560px] md:gap-16 md:px-8 md:pb-[72px] md:pt-12">
        <div className="flex flex-col gap-8 md:gap-10">
          <SectionStamp index="05" label="Say my name" />
          <Reveal kind="wipe">
            <h1
              className="display-condensed m-0 font-display font-extrabold leading-[0.86] tracking-[-0.04em]"
              style={{ fontSize: "var(--text-contact)" }}
            >
              Say
              <br />
              <span className="text-hazmat">my name.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="m-0 max-w-[42ch] text-[17px] leading-[1.5] text-bone/85 md:text-[19px]">
              Open to applied AI roles, freelance builds and nerdy conversations about
              evals. I reply within 48h — faster than most agents.
            </p>
          </Reveal>

          <ul className="m-0 flex list-none flex-col border-t border-line p-0">
            {LINKS.map((k) => (
              <li key={k.name}>
                <Link
                  href={k.href}
                  target={k.href.startsWith("http") ? "_blank" : undefined}
                  rel={k.href.startsWith("http") ? "noreferrer" : undefined}
                  data-cursor="open ↗"
                  className="group flex items-center justify-between gap-4 border-b border-line py-4 text-lg transition-colors hover:text-hazmat md:text-xl"
                >
                  <span>{k.name}</span>
                  <span className="truncate font-mono text-[13px] text-smoke transition-transform duration-200 group-hover:-translate-y-0.5">
                    {k.handle} ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
