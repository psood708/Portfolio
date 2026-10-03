"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SUGGESTIONS, answerFor, tokenize } from "@/lib/ask";
import { EASE_OUT } from "@/lib/motion";

type Source = "claude" | "canned";
type Turn = { question: string; text: string; done: boolean; source: Source };

export default function AskBar() {
  const [value, setValue] = useState("");
  const [turn, setTurn] = useState<Turn | null>(null);
  const abort = useRef<AbortController | null>(null);

  // A second question cancels the first rather than interleaving deltas.
  useEffect(() => () => abort.current?.abort(), []);

  /**
   * Last resort: the route is unreachable (offline, dev server down). Replay the
   * canned answer with the old character-by-character reveal so the bar still
   * behaves like a chat instead of dumping a paragraph.
   */
  const replayCanned = (question: string) => {
    const chunks = tokenize(answerFor(question));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTurn({
        question,
        text: chunks.slice(0, i).join(""),
        done: i >= chunks.length,
        source: "canned",
      });
      if (i >= chunks.length) clearInterval(id);
    }, 28);
  };

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q) return;

    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;

    setTurn({ question: q, text: "", done: false, source: "claude" });
    setValue("");

    let res: Response;
    try {
      res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });
    } catch {
      if (!controller.signal.aborted) replayCanned(q);
      return;
    }

    if (!res.ok || !res.body) {
      replayCanned(q);
      return;
    }

    // The route tells us which corpus answered so the footer can be honest.
    let source: Source =
      res.headers.get("x-ask-source") === "canned" ? "canned" : "claude";

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    try {
      for (;;) {
        const { value: chunk, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const evt = JSON.parse(payload) as { text?: string; source?: Source };
            if (evt.source) source = evt.source;
            if (evt.text) {
              text += evt.text;
              setTurn({ question: q, text, done: false, source });
            }
          } catch {
            /* a partial frame; the next chunk completes it */
          }
        }
      }
    } catch {
      if (controller.signal.aborted) return;
    }

    if (controller.signal.aborted) return;
    if (!text) {
      replayCanned(q);
      return;
    }
    setTurn({ question: q, text, done: true, source });
  };

  const streaming = turn !== null && !turn.done;

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(value);
        }}
        className="flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 p-[6px] pl-[18px] md:gap-3 md:p-2.5 md:pl-[22px]"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={500}
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
                {turn.text}
                {streaming && (
                  <span className="caret-blink ml-0.5 inline-block h-[0.95em] w-[7px] translate-y-[1px] bg-lime align-middle" />
                )}
              </p>
              {turn.done && turn.source === "canned" && (
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
              onClick={() => void ask(s)}
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
