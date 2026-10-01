"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Port of the follow-cursor from `componentDidMount()` in the design doc.
 *
 * Two layers: a 6px lime dot pinned exactly to the pointer, and a lagging ring
 * that eases toward it at 0.18/frame. The ring stretches along its velocity
 * vector and rotates to face it; when the pointer is over anything carrying
 * `data-cursor`, it stops rotating, fills lime and shows that label instead.
 *
 * In the design the cursor only lit up inside `.dv-card` (the canvas frame).
 * Here the whole document is the frame, so it is always live — except on touch
 * and for anyone who asked for reduced motion.
 */
export default function NeuralCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  // Gate on a fine pointer so phones and tablets keep their native behaviour.
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
    document.documentElement.classList.add("has-neural-cursor");
    return () => document.documentElement.classList.remove("has-neural-cursor");
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
      // Speed-driven squash, capped so fast flicks stay readable.
      const speed = Math.min(Math.hypot(vx, vy) / 300, 0.25);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const press = down ? 0.8 : 1;
      const labelled = current !== "";
      const sx = press * (1 + (labelled ? 0 : speed));
      const sy = press * (1 - (labelled ? 0 : speed * 0.6));

      ring.style.transform =
        `translate3d(${rx - w / 2}px, ${ry - h / 2}px, 0) ` +
        `rotate(${labelled ? 0 : angle}deg) scale(${sx}, ${sy})`;

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
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full opacity-0 transition-opacity duration-200"
        style={{ background: labelled ? "transparent" : "var(--color-lime)" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-[34px] min-w-[34px] origin-center items-center justify-center whitespace-nowrap rounded-full border-[1.5px] font-mono text-xs font-semibold opacity-0 transition-[opacity,background,padding,border-color] duration-200"
        style={{
          color: "var(--color-ink)",
          background: labelled ? "var(--color-lime)" : "transparent",
          padding: labelled ? "0 14px" : "0",
          borderColor: labelled
            ? "var(--color-lime)"
            : "oklch(0.86 0.17 125 / 0.6)",
        }}
      >
        {label}
      </div>
    </>
  );
}
