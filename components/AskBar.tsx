"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SUGGESTIONS, answerFor, tokenize } from "@/lib/ask";
import { EASE_OUT } from "@/lib/motion";

type Turn = { question: string; tokens: string[]; shown: number };

export default function AskBar() {
  const [value, setValue] = useState("");
  const [turn, setTurn] = useState<Turn | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reveal the canned answer a few characters at a time so it reads as a stream.
  useEffect(() => {
    if (!turn || turn.shown >= turn.tokens.length) return;
    timer.current = setInterval(() => {
      setTurn((t) =>
        t && t.shown < t.tokens.length ? { ...t, shown: t.shown + 1 } : t,
      );
    }, 28);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [turn]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setTurn({ question: q, tokens: tokenize(answerFor(q)), shown: 0 });
    setValue("");
  };

  const streaming = turn !== null && turn.shown < turn.tokens.length;

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
        }}
        className="flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 p-[6px] pl-[18px] md:gap-3 md:p-2.5 md:pl-[22px]"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask my portfolio anything…"
          aria-label="Ask my portfolio anything"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-bone outline-none placeholder:text-mute-2 md:text-base"
        />
        <button
          type="submit"
          data-cursor="ask ↵"
          className="flex-none rounded-full bg-lime px-[18px] py-3 text-sm font-semibold text-ink transition-transform duration-200 ease-boing hover:scale-[1.04] active:scale-95 md:px-5 md:text-[15px]"
        >
          Ask<span className="hidden md:inline"> ↵</span>
        </button>
      </form>

      <AnimatePresence>
        {turn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="rounded-[18px] border border-line bg-surface p-5">
              <div className="mb-3 flex items-baseline gap-2 font-mono text-[11px] text-mute-3">
                <span className="text-lime">&gt;</span>
                <span className="text-mute-2">{turn.question}</span>
              </div>
              <p
                aria-live="polite"
                className="m-0 text-[15px] leading-[1.55] text-mute-1 md:text-base"
              >
                {turn.tokens.slice(0, turn.shown).join("")}
                {streaming && (
                  <span className="caret-blink ml-0.5 inline-block h-[0.95em] w-[7px] translate-y-[1px] bg-lime align-middle" />
                )}
              </p>
              {!streaming && (
                <p className="mt-4 mb-0 font-mono text-[10px] text-mute-4">
                  canned response · not a live model call
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!turn && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              data-cursor="try it"
              className="rounded-full border border-line-2 px-3 py-1.5 font-mono text-[11px] text-mute-2 transition-colors hover:border-lime hover:text-lime"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
