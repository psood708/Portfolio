import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { LINKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Say hi",
  description:
    "Open to applied AI roles, freelance builds and nerdy conversations about evals. Replies within 48h.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 py-10 md:grid-cols-[minmax(0,1fr)_560px] md:gap-16 md:px-8 md:py-[72px]">
      <div className="flex flex-col gap-7 md:gap-8">
        <h1 className="m-0 text-contact font-extrabold leading-[0.85] tracking-[-0.05em]">
          Say
          <br />
          <span className="text-lime">hi</span> 👋
        </h1>
        <p className="m-0 max-w-[420px] text-[17px] leading-[1.5] text-mute-1 md:text-[19px]">
          Open to applied AI roles, freelance builds and nerdy conversations about
          evals. I reply within 48h — faster than most agents.
        </p>

        <div className="flex flex-col border-t border-line">
          {LINKS.map((k) => (
            <Link
              key={k.name}
              href={k.href}
              data-cursor="open ↗"
              className="group flex items-center justify-between gap-4 border-b border-line py-4 text-lg transition-colors hover:text-lime md:text-xl"
            >
              <span>{k.name}</span>
              <span className="truncate font-mono text-[13px] text-mute-2 transition-transform duration-200 group-hover:-translate-y-0.5">
                {k.handle} ↗
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Reveal>
        <ContactForm />
      </Reveal>
    </section>
  );
}
