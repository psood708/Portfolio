"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { INTERESTS, SITE, tokenMessage } from "@/lib/content";
import { tileFor } from "@/lib/elements";
import { EASE_OUT } from "@/lib/motion";
import ElementTile from "./ElementTile";
import Magnetic from "./Magnetic";

/**
 * No form backend is wired up, so submitting shows the success state and hands
 * over a prefilled mailto so the message actually arrives. To make it a real
 * POST, give the <form> an `action` and delete the mailto branch.
 */
export default function ContactForm() {
  const [picks, setPicks] = useState<string[]>(["Full-time role"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const toggle = (label: string) =>
    setPicks((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]));

  const mailto =
    `mailto:${SITE.email}` +
    `?subject=${encodeURIComponent(`${picks.join(" / ") || "Hello"} — from your site`)}` +
    `&body=${encodeURIComponent(
      `${msg}\n\n—\n${name}${email ? ` · ${email}` : ""}\nLooking for: ${picks.join(", ") || "—"}`,
    )}`;

  return (
    <div className="panel-grid rounded-[28px] border border-line bg-lab p-6 md:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-5"
          >
            <span className="display-condensed font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] text-hazmat md:text-[56px]">
              Received.
            </span>
            <p className="m-0 text-lg text-bone/85">You’re right — Parth.</p>
            <Magnetic>
              <a
                href={mailto}
                data-cursor="open ✉"
                className="block rounded-full bg-hazmat px-6 py-3.5 text-[15px] font-semibold text-tar transition-transform duration-200 ease-boing hover:scale-[1.03]"
              >
                Open in your mail app
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-mono text-[11px] text-smoke underline underline-offset-4 hover:text-bone"
            >
              write another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-6"
          >
            <fieldset className="m-0 border-0 p-0">
              <legend className="lab-label mb-4 p-0 text-smoke">I’m looking for</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {INTERESTS.map((label) => {
                  const on = picks.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggle(label)}
                      data-cursor="pick"
                      aria-pressed={on}
                      className="group flex items-center gap-2.5"
                    >
                      <ElementTile element={tileFor(label)} size="md" tone={on ? "hazmat" : "outline"} className="transition-transform group-hover:-translate-y-0.5" />
                      <span className="text-[14px]" style={{ color: on ? "var(--color-bone)" : "var(--color-smoke)" }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field label="Name">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" className={inputCls} />
            </Field>

            <Field label="Email">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@engine.co" autoComplete="email" className={inputCls} />
            </Field>

            <Field label="Message">
              <textarea
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Tell me what you’re building…"
                className={`${inputCls} h-[120px] resize-none`}
              />
              <span className="mt-1.5 block text-right font-mono text-[11px] text-smoke">{tokenMessage(msg)}</span>
            </Field>

            <Magnetic className="self-start">
              <button
                type="submit"
                data-cursor="send"
                className="rounded-full bg-hazmat px-7 py-4 text-base font-semibold text-tar transition-transform duration-200 ease-boing hover:scale-[1.03] active:scale-95"
              >
                send it
              </button>
            </Magnetic>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full border-b border-bone/20 bg-transparent py-3 font-display text-[17px] text-bone outline-none transition-colors placeholder:text-smoke/70 focus:border-hazmat";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="lab-label text-smoke">{label}</span>
      {children}
    </label>
  );
}
