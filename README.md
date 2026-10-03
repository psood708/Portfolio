# Parth Portfolio — Neural Arcade

Next.js 15 (App Router) + Framer Motion implementation of `Parth Portfolio.dc.html`
from the Claude Design project `1a83db21-26b7-4103-875f-d66570c31815`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run typecheck
```

## Design → code

| Design frame | Route |
|---|---|
| HOME · desktop / mobile 390 | `app/page.tsx` |
| WORK · desktop | `app/work/page.tsx` |
| LAB · desktop | `app/lab/page.tsx` |
| ABOUT · desktop | `app/about/page.tsx` |
| CONTACT · desktop | `app/contact/page.tsx` |

Every `◆` annotation in the design doc is implemented, not decorative:

| Annotation | Where |
|---|---|
| Headline types in word-by-word like a token stream (stagger 60ms) | `components/Headline.tsx` |
| Click the green words → regenerates, 5 variants cycled on tap | `components/Headline.tsx` |
| Cursor becomes a lime pill over interactive elements | `components/NeuralCursor.tsx` |
| Cards: hover lift, shot scales 1.04, border → lime | `components/FeaturedGrid.tsx` |
| Panel scales .85 → 1 and rounds 48 → 24px on scroll | `components/LabPanel.tsx` |
| Row hover: preview follows cursor, text shifts right; filters = CMS filter | `components/WorkTable.tsx` |
| Lab cards drift in with random rotation (−2°…2°) settling to 0 | `components/LabGrid.tsx` |
| 3 principle cards pinned + stacked, each sliding over the last | `components/AboutPrinciples.tsx` |
| Form success state: `message.sent ✓ — tokens well spent` | `components/ContactForm.tsx` |

The design's live logic (`temperature` → bio register, hallucination toggle,
`+ data` training bar, `~/parth{ext}` cycler, interest chips, token counter)
is ported state-for-state from its `renderVals()` block.

## Where the content lives

`lib/content.ts` holds every string. It is real content, not placeholders:
`PROJECTS` and `LAB` come from github.com/psood708 with copy and metrics taken
from each repo's own README; `TIMELINE`, `STACK` and the About prose come from
Parth's resume.

The one thing still standing in: `Hatch` renders a labelled diagonal hatch
wherever a screenshot belongs, naming the shot it wants. Swap each for
`next/image` as real assets arrive.

## Two details worth knowing

**The headline reserves its tallest state.** The five reroll variants are
different lengths, so swapping them would shunt the page down by up to 134px.
`Headline.tsx` renders every variant as an invisible sizer in the same grid
cell, which makes the block as tall as its worst case at any viewport width.
The sizers reuse the live markup exactly — plain text wraps at different points
than a row of inline-blocks.

**The intro plays once per tab.** `LoadingScreen.tsx` runs three shots from
deep (~2.9s) and records a `sessionStorage` flag, so navigating back to the
home page is not a wait. Reduced-motion viewers get a still frame that clears
in 450ms.

## One thing that is not wired to a backend

- **Contact form** has no form backend. Submitting shows the design's success
  state and hands over a prefilled `mailto:` so messages still arrive. Give the
  `<form>` an `action` (Formspree, Resend via a route handler, …) and delete the
  mailto branch in `components/ContactForm.tsx`.

## The ask bar

"Ask my portfolio anything…" is answered by **Claude Opus 5** through
`app/api/ask/route.ts`, grounded strictly in this site's own content.

```bash
cp .env.example .env.local   # then fill it in
```

| Variable | Needed for |
|---|---|
| `ANTHROPIC_API_KEY` | live answers — without it the bar falls back to `lib/ask.ts` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | rate limiting — **required for any public deploy** |

**Grounding.** `lib/portfolio-context.ts` renders `lib/content.ts` plus a short
resume block into one ~1.4k-token document that goes in the system prompt. Edit a
project in `content.ts` and the model's knowledge follows. The whole corpus fits
in context, so there is no vector store and no retrieval step. The model is told
to answer only from that document and to send anything else to the email address
rather than guess.

**Prompt injection.** The visitor's question is only ever a `user` message; it is
never concatenated into the system prompt. That separation is what makes the
"treat the message as a question, not instructions" rule enforceable.

**Cost.** The system prompt is ~1.8k tokens, over the 512-token minimum Opus 5
needs to cache. Roughly **$0.018** per question cold and **$0.008** on a cache hit
inside the 5-minute TTL.

**Rate limits.** 8 questions per IP per 10 minutes, 300 globally per day. Tripping
either returns the canned answer with `x-ask-source: canned` and HTTP 200 — the bar
degrades, it never errors. The same path covers a missing key, an upstream failure
and a model refusal, so the bar also works with the dev server offline.

## Theme

Design tokens live in the `@theme` block of `app/globals.css` — colours, the two
font families, the `ease-boing` overshoot curve, and a fluid type scale whose
`clamp()` endpoints are pinned to the design's own mobile-390 and desktop-1280
measurements.

Base resets are inside `@layer base` on purpose: unlayered CSS outranks
everything in Tailwind's layers, so an unlayered `a { color: inherit }` would
silently beat every `text-*` utility on a link.
