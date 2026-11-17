"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { FOOTER, LINKS, SITE } from "@/lib/content";
import Reveal from "./Reveal";
import TransitionLink from "./TransitionLink";

type Props = { stamp: string | null };

export default function Footer({ stamp }: Props) {
  const pathname = usePathname();
  const [aside, setAside] = useState(false);
  // The contact page is already one big "say my name", so it skips the sendoff.
  const sendoff = pathname !== "/contact";

  return (
    <footer className="mx-auto max-w-[1280px] px-5 md:px-8">
      {sendoff && (
        <div className="flex flex-col items-start justify-between gap-8 border-t border-line py-12 md:mt-16 md:flex-row md:items-end md:py-16">
          <TransitionLink
            href="/contact"
            data-cursor="say it"
            onPointerEnter={() => setAside(true)}
            onPointerLeave={() => setAside(false)}
            onFocus={() => setAside(true)}
            onBlur={() => setAside(false)}
            className="group flex flex-col gap-3"
          >
            <Reveal kind="wipe">
              <h2
                className="display-condensed m-0 font-display font-extrabold leading-[0.9] tracking-[-0.03em] transition-colors group-hover:text-hazmat"
                style={{ fontSize: "var(--text-sendoff)" }}
              >
                {FOOTER.sendoff}
              </h2>
            </Reveal>
            <motion.span
              aria-hidden
              className="lab-label text-smoke"
              animate={{ opacity: aside ? 1 : 0, x: aside ? 0 : -8 }}
              transition={{ duration: 0.25 }}
            >
              {FOOTER.aside}
            </motion.span>
          </TransitionLink>

          <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-left md:items-end md:text-right">
            {LINKS.map((k) => (
              <li key={k.name}>
                <Link
                  href={k.href}
                  target={k.href.startsWith("http") ? "_blank" : undefined}
                  rel={k.href.startsWith("http") ? "noreferrer" : undefined}
                  data-cursor="open ↗"
                  className="text-[15px] text-smoke transition-colors hover:text-bone md:text-base"
                >
                  {k.name} <span className="font-mono text-[12px]">{k.handle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[11px] text-smoke md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-3">
          {stamp && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={stamp} alt="" width={24} height={24} className="pixelated size-6 rounded-[3px]" />
          )}
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span className="lab-label text-hazmat/80">{SITE.stamp} · {new Date().getFullYear()}</span>
        <span>{SITE.footerNote}</span>
      </div>
    </footer>
  );
}
