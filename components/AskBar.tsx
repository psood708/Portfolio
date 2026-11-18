"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SUGGESTIONS, answerFor, tokenize } from "@/lib/ask";
import { EASE_OUT } from "@/lib/motion";
import ElementTile from "./ElementTile";
import Magnetic from "./Magnetic";
import SectionStamp from "./SectionStamp";

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
    <div className="flex flex-col gap-5">
      <SectionStamp index="02" label="Intercom" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(value);
        }}
        className="flex items-center gap-3 border-b border-line pb-3 transition-colors focus-within:border-crystal md:gap-4"
      >
        <span className="font-mono text-lg text-crystal" aria-hidden>
          &gt;
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={500}
          placeholder="ask the lab anything…"
          aria-label="Ask the lab anything"
          className="min-w-0 flex-1 bg-transparent font-display text-[18px] text-bone outline-none placeholder:text-smoke md:text-[22px]"
        />
        <Magnetic>
          <button
            type="submit"
            data-cursor="ask"
            className="flex-none rounded-full bg-hazmat px-5 py-2.5 font-mono text-[13px] font-medium text-tar transition-transform duration-200 ease-boing hover:scale-[1.04] active:scale-95"
          >
            ask ↵
          </button>
        </Magnetic>
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
            <div className="rounded-[20px] border border-line bg-lab p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-[12px] text-smoke">
                  <span className="text-crystal">&gt;</span> {turn.question}
                </span>
                <span className="lab-label text-smoke">
                  response · {turn.source === "canned" ? "canned" : "grounded"}
                </span>
              </div>
              <p
                aria-live="polite"
                className="m-0 font-mono text-[14px] leading-[1.65] text-bone/90 md:text-[15px]"
              >
                {turn.text}
                {streaming && (
                  <span className="caret-blink ml-0.5 inline-block h-[0.95em] w-[7px] translate-y-[1px] bg-crystal align-middle" />
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!turn && (
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
          {SUGGESTIONS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => void ask(s)}
                data-cursor="try it"
                className="group flex items-center gap-3 text-left"
              >
                <ElementTile element={{ symbol: `Q${i + 1}`, number: 0, name: s }} size="md" tone="outline" className="transition-colors group-hover:bg-lab" />
                <span className="font-mono text-[12px] text-smoke transition-colors group-hover:text-bone">{s}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
