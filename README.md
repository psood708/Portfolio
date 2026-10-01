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

`lib/content.ts` holds every string from the design. Replace these placeholders:

- `SITE.email` — `parth@yourdomain.dev`
- `TIMELINE` — `Company One` / `Two` / `Three`
- `LINKS` — social URLs
- `PROJECTS` / `LAB` — project copy and metrics
- `Hatch` components render a labelled diagonal hatch wherever a screenshot
  belongs. Swap each for `next/image` as real assets arrive.

## Two things that are not wired to a backend

- **"Ask my portfolio anything…"** streams keyword-matched canned answers from
  `lib/ask.ts`, client-side. The panel labels itself "canned response · not a
  live model call". To make it real, point `AskBar` at a route handler; the UI
  does not change.
- **Contact form** has no form backend. Submitting shows the design's success
  state and hands over a prefilled `mailto:` so messages still arrive. Give the
  `<form>` an `action` (Formspree, Resend via a route handler, …) and delete the
  mailto branch in `components/ContactForm.tsx`.

## Theme

Design tokens live in the `@theme` block of `app/globals.css` — colours, the two
font families, the `ease-boing` overshoot curve, and a fluid type scale whose
`clamp()` endpoints are pinned to the design's own mobile-390 and desktop-1280
measurements.

Base resets are inside `@layer base` on purpose: unlayered CSS outranks
everything in Tailwind's layers, so an unlayered `a { color: inherit }` would
silently beat every `text-*` utility on a link.
