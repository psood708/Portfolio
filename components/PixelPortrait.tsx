"use client";

import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOGO_TILE } from "@/lib/elements";
import { EASE_OUT } from "@/lib/motion";
import { PIXEL_END, PIXEL_START, quantizeBlocks } from "@/lib/pixelate";
import ElementTile from "./ElementTile";

type Props = { src: string | null };

const CORNERS = [
  "left-0 top-0 border-l-[3px] border-t-[3px] origin-top-left",
  "right-0 top-0 border-r-[3px] border-t-[3px] origin-top-right",
  "left-0 bottom-0 border-l-[3px] border-b-[3px] origin-bottom-left",
  "right-0 bottom-0 border-r-[3px] border-b-[3px] origin-bottom-right",
];

/**
 * The portrait as pixel art in the lab palette. The photo is rasterised to a
 * canvas, averaged into blocks and every block snapped to a site colour. On
 * scroll into view the blocks resolve from 48px to 6px; hover shows the real
 * photo underneath and a click pins it. Without a photo the hazmat bracket
 * frame holds the `Pa` tile.
 */
export default function PixelPortrait({ src }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, amount: 0.3 });

  return (
    <div ref={frame} className="relative p-3">
      {CORNERS.map((c) => (
        <motion.span
          key={c}
          aria-hidden
          className={`absolute size-7 border-hazmat ${c}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
        />
      ))}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-lab">
        {src ? <Sprite src={src} go={inView} /> : <Empty />}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="panel-grid flex h-full w-full items-center justify-center">
      <ElementTile element={LOGO_TILE} size="xl" flip />
    </div>
  );
}

function Sprite({ src, go }: { src: string; go: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pixels = useRef<{ data: Uint8ClampedArray; w: number; h: number } | null>(null);
  const lastBlock = useRef(0);
  const [calm, setCalm] = useState(false);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const block = useMotionValue(PIXEL_START);

  useEffect(() => {
    setCalm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const paint = useCallback((b: number) => {
    const c = canvas.current;
    const px = pixels.current;
    if (!c || !px) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const q = quantizeBlocks(px.data, px.w, px.h, b);
    for (let i = 0; i < q.colors.length; i++) {
      const [r, g, bl] = q.colors[i];
      ctx.fillStyle = `rgb(${r} ${g} ${bl})`;
      ctx.fillRect((i % q.cols) * b, Math.floor(i / q.cols) * b, b, b);
    }
    lastBlock.current = b;
  }, []);

  // Rasterise the photo at the canvas's own size, cover-cropped.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const w = Math.max(1, Math.round(c.clientWidth));
      const h = Math.max(1, Math.round(c.clientHeight));
      c.width = w;
      c.height = h;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return;
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      octx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      pixels.current = { data: octx.getImageData(0, 0, w, h).data, w, h };
      paint(calm ? PIXEL_END : Math.round(block.get()));
    };
  }, [src, calm, block, paint]);

  useEffect(() => {
    if (!go) return;
    if (calm) {
      block.set(PIXEL_END);
      paint(PIXEL_END);
      return;
    }
    const ctrl = animate(block, PIXEL_END, { duration: 1.1, ease: EASE_OUT });
    return () => ctrl.stop();
  }, [go, calm, block, paint]);

  useMotionValueEvent(block, "change", (v) => {
    const b = Math.round(v);
    if (b !== lastBlock.current) paint(b);
  });

  const showReal = hover || pinned;

  return (
    <button
      type="button"
      onClick={() => setPinned((p) => !p)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      data-cursor={pinned ? "pixelate" : "reveal"}
      aria-pressed={pinned}
      aria-label={pinned ? "Show the pixel portrait" : "Show the real photo"}
      className="relative block h-full w-full"
    >
      <canvas ref={canvas} aria-hidden className="pixelated absolute inset-0 h-full w-full" />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: showReal ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <Image src={src} alt="Parth Sood" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" priority={false} />
      </motion.div>
    </button>
  );
}
