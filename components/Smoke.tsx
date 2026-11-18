"use client";

import { useEffect, useRef, useState } from "react";

type Props = { intensity?: number; className?: string };

type Plume = { x: number; y: number; r: number; v: number; w: number; p: number; a: number };

/**
 * Ambient smoke: soft radial blobs drifting up from the horizon, drawn at a
 * quarter of the element's resolution and upscaled, capped at 30 fps, paused
 * off-screen. Fine pointers only, and never under reduced motion.
 */
export default function Smoke({ intensity = 1, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOn(fine.matches && !calm.matches);
    sync();
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let plumes: Plume[] = [];
    let visible = true;
    let raf = 0;
    let last = 0;

    const seed = (): Plume => ({
      x: Math.random(),
      y: 0.78 + Math.random() * 0.3,
      r: 0.12 + Math.random() * 0.16,
      v: 0.00025 + Math.random() * 0.0004,
      w: 0.4 + Math.random() * 0.8,
      p: Math.random() * Math.PI * 2,
      a: 0.03 + Math.random() * 0.05,
    });

    const resize = () => {
      w = Math.max(1, Math.floor(canvas.clientWidth / 4));
      h = Math.max(1, Math.floor(canvas.clientHeight / 4));
      canvas.width = w;
      canvas.height = h;
      if (plumes.length === 0) plumes = Array.from({ length: 9 }, seed);
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || t - last < 33) return;
      const dt = Math.min(t - last, 100);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const pl of plumes) {
        pl.y -= pl.v * dt;
        pl.x += Math.sin(t * 0.0003 * pl.w + pl.p) * 0.00012 * dt;
        if (pl.y + pl.r < 0) Object.assign(pl, seed(), { y: 1.05 });
        const cx = pl.x * w;
        const cy = pl.y * h;
        const r = pl.r * Math.max(w, h);
        const fade = Math.min(1, pl.y * 1.4);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(236, 233, 223, ${pl.a * intensity * fade})`);
        g.addColorStop(1, "rgba(236, 233, 223, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [on, intensity]);

  if (!on) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ filter: "blur(10px)" }}
    />
  );
}
