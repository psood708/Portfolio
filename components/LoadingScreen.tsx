"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Entry screen: a shooter drains threes into a hoop at centre court.
 *
 * The ball's arc is a real parabola — x moves linearly while y runs up then
 * down on mirrored easings — so it reads as a shot rather than a slide. Each
 * cycle the shooter relocates around the arc, loads, releases, and the net
 * snaps on the swish.
 *
 * It holds for one full possession, then leaves. Reduced-motion viewers get a
 * still frame that clears almost immediately, and it only plays once per tab
 * so navigating back to the home page is not a wait.
 */

const SHOTS = [
  { x: 92, flip: 1 },
  { x: 318, flip: -1 },
  { x: 150, flip: 1 },
] as const;

const HOOP = { x: 205, y: 104 };
const SHOT_MS = 950;

export default function LoadingScreen() {
  const [done, setDone] = useState(true);
  const [shot, setShot] = useState(0);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("arcade-intro") === "1";
    } catch {
      /* private mode: just play it */
    }
    if (seen) return;

    setCalm(reduce);
    setDone(false);
    const hold = reduce ? 450 : SHOT_MS * SHOTS.length;
    const t = setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem("arcade-intro", "1");
      } catch {
        /* nothing to remember, nothing to do */
      }
    }, hold);
    return () => clearTimeout(t);
  }, []);

  // Lock the page behind the overlay so nothing scrolls under it.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  useEffect(() => {
    if (done || calm) return;
    const id = setInterval(() => setShot((n) => n + 1), SHOT_MS);
    return () => clearInterval(id);
  }, [done, calm]);

  const from = SHOTS[shot % SHOTS.length];
  const apex = Math.min(from.x, HOOP.x) + Math.abs(HOOP.x - from.x) / 2;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-ink"
          role="status"
          aria-label="Loading"
        >
          <svg
            viewBox="0 0 410 230"
            className="w-[min(88vw,560px)] overflow-visible"
            aria-hidden
          >
            {/* ── court ──────────────────────────────────────────────── */}
            <line
              x1="0" y1="212" x2="410" y2="212"
              stroke="var(--color-line-2)" strokeWidth="2"
            />
            <path
              d="M 95 212 A 110 86 0 0 1 315 212"
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="2"
              strokeDasharray="5 7"
            />

            {/* ── hoop, centre screen ────────────────────────────────── */}
            <g>
              <rect
                x="167" y="44" width="76" height="52" rx="4"
                fill="none" stroke="var(--color-line-2)" strokeWidth="3"
              />
              <rect
                x="188" y="68" width="34" height="24" rx="2"
                fill="none" stroke="var(--color-mute-3)" strokeWidth="2"
              />
              {/* rim */}
              <motion.ellipse
                cx={HOOP.x} cy={HOOP.y} rx="30" ry="7"
                fill="none" stroke="var(--color-lime)" strokeWidth="4"
                animate={calm ? {} : { ry: [7, 8.5, 7] }}
                transition={{ duration: 0.3, delay: 0.72, repeat: Infinity, repeatDelay: SHOT_MS / 1000 - 0.3 }}
              />
              {/* net — snaps on the swish */}
              <motion.g
                stroke="var(--color-mute-2)"
                strokeWidth="1.5"
                animate={calm ? {} : { scaleY: [1, 1.35, 1], opacity: [0.75, 1, 0.75] }}
                style={{ transformOrigin: `${HOOP.x}px ${HOOP.y}px` }}
                transition={{ duration: 0.38, delay: 0.72, repeat: Infinity, repeatDelay: SHOT_MS / 1000 - 0.38 }}
              >
                {[-26, -13, 0, 13, 26].map((dx) => (
                  <line
                    key={dx}
                    x1={HOOP.x + dx} y1={HOOP.y + 4}
                    x2={HOOP.x + dx * 0.45} y2={HOOP.y + 30}
                  />
                ))}
                <line x1={HOOP.x - 20} y1={HOOP.y + 16} x2={HOOP.x + 20} y2={HOOP.y + 16} />
                <line x1={HOOP.x - 13} y1={HOOP.y + 28} x2={HOOP.x + 13} y2={HOOP.y + 28} />
              </motion.g>
              {/* post */}
              <line
                x1="205" y1="44" x2="205" y2="18"
                stroke="var(--color-line-2)" strokeWidth="3"
              />
            </g>

            {/* ── shooter ────────────────────────────────────────────── */}
            <motion.g
              key={`p${shot}`}
              initial={calm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transform={`translate(${from.x} 0) scale(${from.flip} 1) translate(${from.flip === -1 ? -0 : 0} 0)`}
              style={{ transformOrigin: `${from.x}px 212px` }}
            >
              {/* head */}
              <motion.circle
                cx="0" cy="168" r="9"
                fill="var(--color-bone)"
                animate={calm ? {} : { cy: [168, 172, 160, 168] }}
                transition={{ duration: SHOT_MS / 1000, times: [0, 0.22, 0.42, 1] }}
              />
              {/* torso */}
              <motion.line
                x1="0" y1="178" x2="0" y2="196"
                stroke="var(--color-bone)" strokeWidth="6" strokeLinecap="round"
                animate={calm ? {} : { y1: [178, 182, 170, 178], y2: [196, 198, 190, 196] }}
                transition={{ duration: SHOT_MS / 1000, times: [0, 0.22, 0.42, 1] }}
              />
              {/* shooting arm — loads low, extends on release */}
              <motion.path
                fill="none"
                stroke="var(--color-bone)"
                strokeWidth="5"
                strokeLinecap="round"
                animate={
                  calm
                    ? { d: "M 0 182 L 12 168 L 10 154" }
                    : {
                        d: [
                          "M 0 182 L 12 176 L 8 166",
                          "M 0 186 L 14 182 L 10 172",
                          "M 0 174 L 16 160 L 12 146",
                          "M 0 182 L 12 176 L 8 166",
                        ],
                      }
                }
                transition={{ duration: SHOT_MS / 1000, times: [0, 0.22, 0.42, 1] }}
              />
              {/* legs — dip then extend */}
              <motion.path
                fill="none"
                stroke="var(--color-bone)"
                strokeWidth="5"
                strokeLinecap="round"
                animate={
                  calm
                    ? { d: "M 0 196 L -8 212 M 0 196 L 9 212" }
                    : {
                        d: [
                          "M 0 196 L -8 212 M 0 196 L 9 212",
                          "M 0 198 L -11 212 M 0 198 L 12 212",
                          "M 0 190 L -6 212 M 0 190 L 7 212",
                          "M 0 196 L -8 212 M 0 196 L 9 212",
                        ],
                      }
                }
                transition={{ duration: SHOT_MS / 1000, times: [0, 0.22, 0.42, 1] }}
              />
            </motion.g>

            {/* ── the ball ───────────────────────────────────────────── */}
            <motion.g
              key={`b${shot}`}
              initial={{ x: from.x + from.flip * 12, y: 166, opacity: 0 }}
              animate={
                calm
                  ? { x: apex, y: 70, opacity: 1 }
                  : {
                      x: [from.x + from.flip * 12, apex, HOOP.x, HOOP.x],
                      y: [166, 18, HOOP.y, 205],
                      opacity: [0, 1, 1, 0],
                    }
              }
              transition={{
                duration: SHOT_MS / 1000,
                times: [0, 0.38, 0.72, 1],
                ease: ["easeOut", "easeIn", "easeIn"],
              }}
            >
              <motion.g
                animate={calm ? {} : { rotate: from.flip * 360 }}
                transition={{ duration: SHOT_MS / 1000, ease: "linear" }}
              >
                <circle r="11" fill="var(--color-lime)" />
                <g fill="none" stroke="var(--color-ink)" strokeWidth="1.3">
                  <line x1="-11" y1="0" x2="11" y2="0" />
                  <line x1="0" y1="-11" x2="0" y2="11" />
                  <path d="M -7.8 -7.8 A 13 13 0 0 0 7.8 7.8" />
                  <path d="M 7.8 -7.8 A 13 13 0 0 1 -7.8 7.8" />
                </g>
              </motion.g>
            </motion.g>
          </svg>

          <div className="flex flex-col items-center gap-2">
            <p className="m-0 font-mono text-xs text-mute-2">
              <span className="text-lime">$</span> warming up
              <span className="caret-blink ml-1 inline-block h-[0.9em] w-[7px] translate-y-[1px] bg-lime align-middle" />
            </p>
            <p className="m-0 font-mono text-[11px] text-mute-4">
              {calm ? "loading" : `${(shot % SHOTS.length) + 1} / ${SHOTS.length} from deep`}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
