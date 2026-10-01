"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/content";
import Reveal from "./Reveal";

export default function Footer() {
  const pathname = usePathname();
  // The contact page is already one big "say hi", so it skips the sendoff.
  const sendoff = pathname !== "/contact";

  return (
    <footer className="mx-auto max-w-[1280px] px-5 md:px-8">
      {sendoff && (
        <Reveal className="flex flex-col items-start justify-between gap-[18px] border-t border-line py-10 md:mt-16 md:flex-row md:items-end">
          <h2 className="m-0 text-sendoff font-extrabold leading-[0.92] tracking-[-0.04em] md:leading-[0.9] md:tracking-[-0.05em]">
            Let’s build
            <br className="hidden md:block" />{" "}
            <span className="md:hidden"> </span>something{" "}
            <span className="text-lime">smart</span>.
          </h2>
          <div className="flex flex-col gap-1.5 text-left md:gap-2 md:text-right">
            <Link
              href={`mailto:${SITE.email}`}
              data-cursor="copy ✉"
              className="font-semibold transition-colors hover:text-lime md:text-base"
            >
              {SITE.email}
            </Link>
            <span className="text-sm text-mute-2 md:text-base">
              <Link href="https://github.com/parthsood" className="hover:text-bone">
                GitHub
              </Link>{" "}
              ·{" "}
              <Link href="https://linkedin.com/in/parthsood" className="hover:text-bone">
                LinkedIn
              </Link>{" "}
              ·{" "}
              <Link href="https://x.com/parthsood" className="hover:text-bone">
                X
              </Link>
              <span className="hidden md:inline">
                {" "}
                ·{" "}
                <Link href="https://huggingface.co/parthsood" className="hover:text-bone">
                  Hugging Face
                </Link>
              </span>
            </span>
          </div>
        </Reveal>
      )}

      <div className="flex flex-col gap-1 pb-6 pt-8 font-mono text-xs text-mute-4 md:flex-row md:justify-between md:pt-0">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>{SITE.footerNote}</span>
      </div>
    </footer>
  );
}
