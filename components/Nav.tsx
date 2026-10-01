"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EXTENSIONS, NAV } from "@/lib/content";
import { BOING, EASE_OUT } from "@/lib/motion";

export default function Nav() {
  const pathname = usePathname();
  const [ext, setExt] = useState(0);
  const [open, setOpen] = useState(false);

  const onContact = pathname === "/contact";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-[18px] md:px-8 md:py-5">
        {/* ── ~/parth{ext} — click cycles the extension ─────────────────── */}
        <button
          type="button"
          onClick={() => setExt((i) => i + 1)}
          data-cursor="cd ~"
          aria-label="Cycle domain extension"
          className="select-none font-mono text-sm md:text-[15px]"
        >
          <span className="text-lime">~/</span>
          parth
          <span className="hidden text-mute-3 md:inline">
            {EXTENSIONS[ext % EXTENSIONS.length]}
          </span>
        </button>

        {/* ── desktop pill nav ──────────────────────────────────────────── */}
        <nav className="hidden rounded-full bg-surface-2 p-[5px] text-sm md:flex md:gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full px-4 py-2 transition-colors"
                style={{ color: active ? "var(--color-ink)" : undefined }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={BOING}
                    className="absolute inset-0 rounded-full bg-bone"
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Say hi ✌︎ ─────────────────────────────────────────────────── */}
        <Link
          href="/contact"
          data-cursor="hey!"
          className="hidden rounded-full border border-line-2 px-[18px] py-2.5 text-sm transition-transform duration-200 ease-boing hover:-rotate-6 hover:scale-[1.06] md:block"
          style={
            onContact
              ? { background: "var(--color-bone)", color: "var(--color-ink)" }
              : undefined
          }
        >
          Say hi ✌︎
        </Link>

        {/* ── mobile trigger ───────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-lg md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col px-5 py-2">
              {[...NAV, { label: "Say hi ✌︎", href: "/contact" }].map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-line py-4 text-2xl font-semibold tracking-tight last:border-0"
                  style={
                    isActive(item.href) ? { color: "var(--color-lime)" } : undefined
                  }
                >
                  {item.label}
                  <span className="font-mono text-xs text-mute-3">↗</span>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
