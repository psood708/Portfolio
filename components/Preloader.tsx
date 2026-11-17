"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAME_TILES } from "@/lib/elements";
import { BEATS, INTRO_CALM_MS, INTRO_MS, TILE_AT } from "@/lib/intro";
import { EASE_OUT } from "@/lib/motion";
import ElementTile from "./ElementTile";
import { useIntro } from "./IntroProvider";

const TYPED = "$ initiating reaction";

/** The Erlenmeyer flask, drawn once, used as outline and as the liquid's clip. */
const FLASK =
  "M 172 34 L 172 128 L 96 262 Q 86 282 108 282 L 292 282 Q 314 282 304 262 L 228 128 L 228 34 Z";

const BUBBLES = [150, 172, 196, 214, 238, 252, 186].map((x, i) => ({
  x,
  r: 2 + (i % 3),
  delay: 0.95 + i * 0.09,
}));

const SLAM = { type: "spring", stiffness: 520, damping: 22, mass: 0.9 } as const;

/**
 * Rendered as its own component so it reads the phase from context: when the
 * reaction finishes, these unmount in the same commit the hero's tiles mount,
 * and the shared `layoutId`s hand the boxes over with no crossfade — even
 * though the overlay around them is still fading out.
 */
function NameTiles({ ms, calm }: { ms: number; calm: boolean }) {
  const { phase } = useIntro();
  if (phase !== "playing") return null;

  const tilesShown = calm ? 4 : TILE_AT.filter((t) => ms >= t).length;
  const oodShown = calm || ms >= BEATS.ood;
  const lastSlam = tilesShown > 0 ? TILE_AT[tilesShown - 1] : -1;
  const shaking = !calm && lastSlam >= 0 && ms - lastSlam < 180;

  return (
    <motion.div
      className="relative flex flex-col gap-[clamp(6px,0.6vw,10px)]"
      animate={shaking ? { x: [0, -7, 6, -3, 0] } : { x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex gap-[clamp(6px,0.6vw,10px)]">
        {NAME_TILES.slice(0, 3).map((e, i) =>
          tilesShown > i ? (
            <motion.div
              key={e.symbol}
              initial={calm ? false : { scale: 1.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SLAM}
            >
              <ElementTile element={e} size="xl" layoutId={`tile-${e.symbol}`} />
            </motion.div>
          ) : (
            <div key={e.symbol} style={{ width: "var(--tile)", height: "var(--tile)" }} />
          ),
        )}
      </div>
      <div className="flex items-end gap-[clamp(6px,0.6vw,10px)]">
        {tilesShown > 3 ? (
          <motion.div
            initial={calm ? false : { scale: 1.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SLAM}
          >
            <ElementTile element={NAME_TILES[3]} size="xl" layoutId="tile-S" />
          </motion.div>
        ) : (
          <div style={{ width: "var(--tile)", height: "var(--tile)" }} />
        )}
        <motion.span
          className="display-condensed pb-[0.04em] font-display font-extrabold leading-none tracking-[-0.03em]"
          style={{ fontSize: "calc(var(--tile) * 0.78)" }}
          initial={calm ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: oodShown ? 1 : 0, x: oodShown ? 0 : -12 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          ood
        </motion.span>
      </div>
    </motion.div>
  );
}

/**
 * "The Reaction". A flask draws itself, fills with crystal, flashes hazmat,
 * and the four name tiles slam in over the smoke. The tiles carry `layoutId`s
 * the hero's title card shares, so when this unmounts they glide into place
 * rather than animating twice. Once per tab; reduced motion gets a still
 * frame for 450 ms.
 */
export default function Preloader() {
  const { phase, finish } = useIntro();
  const playing = phase === "playing";
  const [calm, setCalm] = useState(false);
  const [ms, setMs] = useState(0);
  // The overlay outlives `playing` by one fade, then unmounts for good. Done by
  // hand rather than AnimatePresence so nothing invisible can linger over the
  // page and eat clicks.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (playing) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const t = setTimeout(() => setMounted(false), 550);
    return () => clearTimeout(t);
  }, [playing, mounted]);

  useEffect(() => {
    setCalm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // One clock for every beat, so the timeline reads top to bottom.
  useEffect(() => {
    if (!playing) return;
    if (calm) {
      const t = setTimeout(finish, INTRO_CALM_MS);
      return () => clearTimeout(t);
    }
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = performance.now() - start;
      setMs(t);
      if (t >= INTRO_MS) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // A hidden tab throttles rAF; the page must never stay locked behind us.
    const safety = setTimeout(finish, INTRO_MS + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [playing, calm, finish]);

  // Lock the page behind the overlay.
  useEffect(() => {
    if (!playing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [playing]);

  const typed = calm ? TYPED : TYPED.slice(0, Math.floor((ms / 300) * TYPED.length));
  const flaskGone = calm || ms >= BEATS.flash + 100;

  if (!mounted) return null;

  return (
    <motion.div
      key="reaction"
      initial={{ opacity: 1 }}
      animate={{ opacity: playing ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-tar"
      style={{ pointerEvents: playing ? "auto" : "none" }}
      role="status"
      aria-label="Loading"
      aria-hidden={!playing}
    >
          {/* ── the flask ─────────────────────────────────────────────── */}
          {!calm && (
            <motion.svg
              viewBox="0 0 400 320"
              className="absolute w-[min(70vw,420px)] overflow-visible"
              aria-hidden
              animate={{ opacity: flaskGone ? 0 : 1, scale: flaskGone ? 1.08 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <defs>
                <clipPath id="flask-clip">
                  <path d={FLASK} />
                </clipPath>
              </defs>

              {/* liquid, clipped to the glass (the clip sits on the group so
                  the rect can move inside it) */}
              <g clipPath="url(#flask-clip)">
                <motion.rect
                  x="60"
                  width="280"
                  height="320"
                  fill="var(--color-crystal)"
                  initial={{ y: 290 }}
                  animate={{ y: ms >= BEATS.fill ? 168 : 290 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                />
              </g>

              {/* bubbles */}
              {ms >= BEATS.fill &&
                BUBBLES.map((b, i) => (
                  <motion.circle
                    key={i}
                    cx={b.x}
                    r={b.r}
                    fill="var(--color-bone)"
                    initial={{ cy: 276, opacity: 0 }}
                    animate={{ cy: 180, opacity: [0, 0.9, 0] }}
                    transition={{
                      duration: 0.9,
                      delay: b.delay - BEATS.fill / 1000,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}

              {/* the glass */}
              <motion.path
                d={FLASK}
                fill="none"
                stroke="var(--color-bone)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: ms >= BEATS.flask ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
              {/* the rim */}
              <motion.path
                d="M 160 34 L 240 34"
                stroke="var(--color-bone)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: ms >= BEATS.flask + 400 ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* smoke from the neck after the flash */}
              {ms >= BEATS.flash &&
                [0, 1, 2].map((i) => (
                  <motion.circle
                    key={`s${i}`}
                    cx={200 + (i - 1) * 18}
                    r={22}
                    fill="var(--color-bone)"
                    style={{ filter: "blur(14px)" }}
                    initial={{ cy: 40, opacity: 0, scale: 0.6 }}
                    animate={{ cy: -60, opacity: [0, 0.45, 0], scale: 1.8 }}
                    transition={{ duration: 1.1, delay: i * 0.12, ease: "easeOut" }}
                  />
                ))}
            </motion.svg>
          )}

          {/* ── hazmat flash ──────────────────────────────────────────── */}
          {!calm && ms >= BEATS.flash && (
            <motion.div
              className="absolute inset-0 bg-hazmat"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.12, times: [0, 0.3, 1] }}
            />
          )}

          <NameTiles ms={ms} calm={calm} />

          {/* ── the typed line ────────────────────────────────────────── */}
          <p className="absolute bottom-10 left-5 m-0 font-mono text-xs text-smoke md:left-8">
            <span className="text-crystal">{typed.slice(0, 1)}</span>
            {typed.slice(1)}
            <span className="caret-blink ml-1 inline-block h-[0.9em] w-[7px] translate-y-[1px] bg-crystal align-middle" />
          </p>
    </motion.div>
  );
}
