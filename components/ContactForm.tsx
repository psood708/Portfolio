"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { INTERESTS, SITE, tokenMessage } from "@/lib/content";
import { BOING, EASE_OUT } from "@/lib/motion";

/**
 * The design calls for a "Native Framer Form". There is no form backend wired
 * up here, so submitting shows the design's own success state and hands over a
 * prefilled mailto so the message actually arrives. To make it a real POST,
 * give the <form> an `action` (Formspree, Resend via a route handler, etc.) and
 * delete the mailto branch.
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
    <div className="rounded-[24px] border border-line bg-surface p-6 md:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-5"
          >
            <span className="text-[32px] font-extrabold tracking-[-0.03em] text-lime md:text-[40px]">
              message.sent ✓
            </span>
            <p className="m-0 text-lg text-mute-1">tokens well spent.</p>
            <a
              href={mailto}
              data-cursor="open ✉"
              className="rounded-full bg-lime px-6 py-3.5 text-[15px] font-semibold text-ink transition-transform duration-200 ease-boing hover:scale-[1.03]"
            >
              Open in your mail app →
            </a>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-mono text-[11px] text-mute-3 underline underline-offset-4 hover:text-mute-1"
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
            className="flex flex-col gap-5"
          >
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-3 p-0 font-mono text-xs text-mute-3">
                I’m looking for…
              </legend>
              <div className="flex flex-wrap gap-2 text-sm">
                {INTERESTS.map((label) => {
                  const on = picks.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggle(label)}
                      data-cursor="pick"
                      aria-pressed={on}
                      className="rounded-full border px-4 py-[9px] transition-colors duration-150"
                      style={{
                        borderColor: on ? "var(--color-lime)" : "var(--color-line-2)",
                        background: on ? "var(--color-lime)" : "transparent",
                        color: on ? "var(--color-ink)" : "var(--color-bone)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field label="Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
                className={inputCls}
              />
            </Field>

            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@engine.co"
                autoComplete="email"
                className={inputCls}
              />
            </Field>

            <Field label="Message">
              <textarea
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Tell me what you’re building…"
                className={`${inputCls} h-[120px] resize-none focus:border-lime`}
              />
              <span className="mt-1.5 block text-right font-mono text-[11px] text-mute-3">
                {tokenMessage(msg)}
              </span>
            </Field>

            <motion.button
              type="submit"
              data-cursor="send 🚀"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={BOING}
              className="rounded-full bg-lime p-[18px] text-center text-base font-semibold text-ink"
            >
              Send it →
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line-2 bg-ink p-4 font-display text-base text-bone outline-none transition-colors placeholder:text-mute-3 focus:border-lime";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-mute-3">{label}</span>
      {children}
    </label>
  );
}
