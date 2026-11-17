"use client";

import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";
import { CONTACT_LABEL, EXTENSIONS, NAV } from "@/lib/content";
import { LOGO_TILE } from "@/lib/elements";
import { BOING, EASE_WIPE, clipUp } from "@/lib/motion";
import ElementTile from "./ElementTile";
import Magnetic from "./Magnetic";
import TransitionLink from "./TransitionLink";

export default function Nav() {
  const pathname = usePathname();
  const [ext, setExt] = useState(0);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Route change closes the menu; the menu locks the page behind it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onContact = pathname === "/contact";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300"
      style={{
        background: scrolled ? "color-mix(in oklch, var(--color-tar) 85%, transparent)" : "transparent",
        borderColor: scrolled ? "var(--color-line)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-8">
        {/* ── [Pa]rth — click cycles the extension ───────────────────── */}
        <button
          type="button"
          onClick={() => setExt((i) => i + 1)}
          data-cursor="cd ~"
          aria-label="Cycle domain extension"
          className="flex select-none items-center gap-1"
        >
          <ElementTile element={LOGO_TILE} size="xs" />
          <span className="font-display text-[19px] font-semibold leading-none tracking-[-0.02em]">
            rth
          </span>
          <span className="hidden font-mono text-[13px] text-smoke md:inline">
            {EXTENSIONS[ext % EXTENSIONS.length]}
          </span>
        </button>

        {/* ── desktop pills ──────────────────────────────────────────── */}
        <nav className="hidden rounded-full border border-line p-[5px] text-sm md:flex md:gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Magnetic key={item.href} strength={6}>
                <TransitionLink
                  href={item.href}
                  className="relative block rounded-full px-4 py-2 transition-colors"
                  style={{ color: active ? "var(--color-tar)" : undefined }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={BOING}
                      className="absolute inset-0 -z-10 rounded-full bg-hazmat"
                    />
                  )}
                  {item.label}
                </TransitionLink>
              </Magnetic>
            );
          })}
        </nav>

        {/* ── Say my name ─────────────────────────────────────────────── */}
        <div className="hidden md:block">
          {!onContact && (
            <Magnetic>
              <TransitionLink
                href="/contact"
                data-cursor="say it"
                className="block rounded-full border px-[18px] py-2.5 text-sm transition-colors duration-200 hover:border-hazmat hover:bg-hazmat hover:text-tar"
                style={{ borderColor: "color-mix(in oklch, var(--color-bone) 40%, transparent)" }}
              >
                {CONTACT_LABEL}
              </TransitionLink>
            </Magnetic>
          )}
        </div>

        {/* ── mobile trigger ─────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-[70] flex size-11 items-center justify-center rounded-full border border-line text-lg md:hidden"
          style={open ? { background: "var(--color-hazmat)", color: "var(--color-tar)" } : undefined}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* ── mobile menu: wipes up in lab green ──────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE_WIPE }}
            className="fixed inset-0 z-[65] flex flex-col justify-end bg-lab px-5 pb-12 pt-24 md:hidden"
          >
            <motion.div
              initial="hidden"
              animate="shown"
              transition={{ staggerChildren: 0.06, delayChildren: 0.25 }}
              className="flex flex-col"
            >
              {[...NAV, { label: CONTACT_LABEL, href: "/contact" }].map((item) => (
                <motion.div key={item.href} variants={clipUp}>
                  <TransitionLink
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b py-5 font-display text-[44px] font-extrabold leading-none tracking-[-0.03em]"
                    style={{
                      borderColor: "color-mix(in oklch, var(--color-bone) 15%, transparent)",
                      color: isActive(item.href) ? "var(--color-hazmat)" : "var(--color-bone)",
                      fontVariationSettings: '"wdth" 80',
                    }}
                  >
                    {item.label}
                    <span className="font-mono text-xs text-smoke">↗</span>
                  </TransitionLink>
                </motion.div>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
