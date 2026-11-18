# Parth Sood — The Lab

Next.js 15 (App Router) + Framer Motion 11 + Tailwind 4. A portfolio built as a
lab: element-tile typography, a Breaking Bad palette, a cinematic preloader,
scroll-driven scenes and page wipes. Design and plan live in
`docs/superpowers/`.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest, the pure helpers in lib/
npm run typecheck
npm run build      # runs scripts/make-icon.mjs first (see Images)
```

## The concept

Parth is an applied AI engineer who runs his work like a lab. The periodic table
is the type system: his name is `[P][Ar][Th]` over `[S]ood`, the stack is a
row of tiles, projects are **batches** with a **purity** readout (their headline
metric), smaller builds are **experiments** from the RV, and the Claude-grounded
ask bar is the **intercom**.

Vocabulary is chemistry only: lab, batch, purity, yield, precursor, reaction,
contaminants. The words "cook" and "meth" never appear, and the word "chemist"
never describes Parth — `tests/content.test.ts` enforces both.

## Where things live

| What | Where |
|---|---|
| Every string, project, lab entry, timeline row | `lib/content.ts` |
| Element symbols and the name/stack tile mapping | `lib/elements.ts` |
| Image lookup by slug (server only) | `lib/assets.ts` |
| Colour quantisation shared by the portrait and the favicon script | `lib/pixelate.ts` |
| Deterministic chromatogram traces for the spectrum plates | `lib/chromatogram.ts` |
| Palette, fonts, fluid type scale, textures | `app/globals.css` (`@theme`) |
| Timing constants and reveal variants | `lib/motion.ts` |
| Intro once-per-tab rule and beat timings | `lib/intro.ts` |

## Images

Drop files in and the site picks them up; nothing to edit.

| Asset | Path | Notes |
|---|---|---|
| Project screenshots | `public/work/<slug>.png` | slugs from `PROJECTS` in `lib/content.ts`; `.webp`/`.jpg` also work |
| Experiment screenshots | `public/lab/<slug>.png` | slugs from `LAB` |
| Portrait | `public/portrait.jpg` | ≥ 1200×1500, plain background |

Cards without a screenshot render a **spectrum plate** (stack tiles, batch
number, chromatogram) rather than a placeholder. The portrait is pixelated in
the browser into the site palette and resolves on scroll; hover shows the real
photo, click pins it. Without a portrait the frame holds the `Pa` tile.

`npm run build` runs `scripts/make-icon.mjs`, which turns the portrait into
`public/pixel-portrait.png` (the 24px footer stamp) and `app/icon.png` (the
favicon). With no portrait it exits quietly and `app/icon.svg` stays the icon.

## Motion system

- **Preloader** (`components/Preloader.tsx`): flask draws, fills with crystal,
  flashes hazmat, four name tiles slam in. Once per tab (`sessionStorage`
  `lab-intro`). The tiles hand off to the hero's title card through shared
  `layoutId`s. Reduced motion: a still frame for 450 ms.
- **Hero**: title card, reroll sub-headline, parallax tile field, canvas smoke.
- **Readouts**: purity dial (drives the bio), contaminants switch, yield bar.
- **Caution band**: two hazmat tapes whose speed follows scroll velocity.
- **Batches**: pinned horizontal scroll on fine-pointer desktops; a list elsewhere.
- **Page wipes** (`components/TransitionProvider.tsx` + `app/template.tsx`):
  hazmat then lab rise to cover, the new page mounts, both lift from the top.
- **Cursor**: crystal ring; a hazmat pill with a label over `data-cursor`
  elements; inverts over `data-cursor-invert` images.
- Every canvas and scroll scene has a `prefers-reduced-motion` branch and the
  canvases never mount on touch devices.

## The ask bar

"Ask the lab anything" is answered by Claude through `app/api/ask/route.ts`,
grounded strictly in `lib/portfolio-context.ts`, which renders from
`lib/content.ts`. Without `ANTHROPIC_API_KEY` (or when rate-limited) it falls
back to the canned corpus in `lib/ask.ts` and labels the answer `canned`.

```bash
cp .env.example .env.local   # ANTHROPIC_API_KEY, UPSTASH_REDIS_REST_URL/_TOKEN
```

Rate limits: 8 questions per IP per 10 minutes, 300 a day globally, via
Upstash. Both variables are required for a public deploy.

## Contact form

No backend: submitting shows the success state and opens a prefilled `mailto:`.
Give the `<form>` in `components/ContactForm.tsx` an `action` to make it a real
POST.
