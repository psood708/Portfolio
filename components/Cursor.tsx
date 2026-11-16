"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The crystal cursor. Two layers: a 4px dot pinned to the pointer and a ring
 * that eases toward it at 0.18/frame, stretching along its velocity. Over
 * anything carrying `data-cursor` the ring becomes a hazmat pill showing that
 * label; over `data-cursor-invert` (images, plates) it grows and inverts.
 * Fine pointers only, and never for anyone who asked for reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [invert, setInvert] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !calm.matches);
    sync();
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let down = false;
    let visible = false;
    let current = "";
    let inverted = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const target = e.target as Element | null;
      const hit = target?.closest?.("[data-cursor]") ?? null;
      const next = hit?.getAttribute("data-cursor") ?? "";
      if (next !== current) {
        current = next;
        setLabel(next);
      }
      const inv = !!target?.closest?.("[data-cursor-invert]");
      if (inv !== inverted) {
        inverted = inv;
        setInvert(inv);
      }
    };

    const leave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

      const w = ring.offsetWidth;
      const h = ring.offsetHeight;
      const vx = mx - rx;
      const vy = my - ry;
      const speed = Math.min(Math.hypot(vx, vy) / 300, 0.25);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const press = down ? 0.8 : 1;
      const still = current !== "" || inverted;
      const sx = press * (1 + (still ? 0 : speed));
      const sy = press * (1 - (still ? 0 : speed * 0.6));

      ring.style.transform =
        `translate3d(${rx - w / 2}px, ${ry - h / 2}px, 0) ` +
        `rotate(${still ? 0 : angle}deg) scale(${sx}, ${sy})`;

      raf = requestAnimationFrame(tick);
    };

    const dn = () => {
      down = true;
    };
    const up = () => {
      down = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const labelled = label !== "";

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[2px] -mt-[2px] size-1 rounded-full opacity-0 transition-opacity duration-200"
        style={{
          background: labelled || invert ? "transparent" : "var(--color-crystal)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex origin-center items-center justify-center whitespace-nowrap rounded-full border-[1.5px] font-mono text-[11px] font-medium opacity-0 transition-[opacity,background,padding,border-color,width,height] duration-200"
        style={{
          height: invert && !labelled ? 44 : 28,
          minWidth: invert && !labelled ? 44 : 28,
          padding: labelled ? "0 12px" : 0,
          color: "var(--color-tar)",
          background: labelled
            ? "var(--color-hazmat)"
            : invert
              ? "var(--color-bone)"
              : "transparent",
          borderColor: labelled
            ? "var(--color-hazmat)"
            : invert
              ? "var(--color-bone)"
              : "color-mix(in oklch, var(--color-crystal) 70%, transparent)",
          mixBlendMode: invert && !labelled ? "difference" : "normal",
        }}
      >
        {label}
      </div>
    </>
  );
}
