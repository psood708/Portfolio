# Design: "The Lab" — Breaking Bad reframe of the Parth Sood portfolio

Date: 2026-11-16
Status: awaiting approval · images: Parth will supply screenshots and a portrait (see section 6 for paths)
Working copy: `/Users/psood/MLops/Framer_Parth_BB` (full copy of `Framer_Parth`, including git history, uncommitted Work/Lab merge and `.env.local`). The original folder is not touched.

## 1. Intent and the why

Parth wants the portfolio to be a serious contender for Awwwards (Site of the Day, portfolio category). The current "Neural Arcade" site is clean and well engineered but visually generic for that audience: dark background, lime accent, card grid. The brief is to rebuild it around a Breaking Bad theme — the show's palette, mood and motifs — with motion graphics as the primary craft signal, while keeping it a working portfolio that a recruiter can read in two minutes.

The content (projects, lab entries, bio, timeline, the Claude-grounded ask bar) stays. What changes is the entire presentation layer and the language every label and interaction speaks.

Chosen depth: **full reframe**. Not atmosphere-only (would read as a palette swap), not in-character (no Heisenberg persona, the AI keeps answering as Parth).

## 2. Goals, non-goals, anti-goals

### Goals
- A site a jury recognises as intentional in the first second: preloader, hero and cursor all belong to one world.
- Motion is the craft signal: a cinematic preloader, scroll-driven scenes, kinetic typography, page transitions, a reactive cursor, ambient smoke/grain. Every animation earns its place and most are tied to scroll or input, not autoplay loops.
- Breaking Bad is unmistakable without any copyrighted asset: periodic-table element tiles, lab green, hazmat yellow, blue crystal, desert haze, caution tape, lab-notebook typography.
- Still a portfolio: name, role, work, contact reachable in one scroll or one click. Copy stays Parth's, in first person.
- Works at 390px, at 1280px+, with `prefers-reduced-motion`, and with the dev server offline (ask bar falls back to canned answers as today).
- Lighthouse performance stays green on desktop (≥ 90) and acceptable on mobile (≥ 75) — juries check.

### Non-goals
- No new backend features. The ask API, rate limiting and contact `mailto:` flow are kept as they are.
- No new content. Projects, lab entries, timeline, stack, links are reused from `lib/content.ts`; only labels, headings and gag copy are rewritten.
- No WebGL / Three.js. Smoke and particles are 2D canvas or SVG filters.
- No CMS, no analytics, no i18n.

### Anti-goals (failure even if it works)
- Looks like the old site with new colours.
- Uses show imagery, character likenesses, logo files or lifted quotes beyond short cultural nods ("Say my name", "No half measures").
- Reads as a drug reference to a recruiter. The vocabulary is **chemistry**: lab, batch, purity, formula, reaction, precursor, yield, contaminants. The words "cook", "meth", "product" (as drug) do not appear.
- Motion that blocks reading: nothing autoplays over body copy, the preloader never exceeds 3 s, scroll never gets hijacked without a visible end.
- Mobile as an afterthought: every scene has a designed phone layout, not a collapsed desktop one.

## 3. Constraints
- Stack is fixed: Next.js 15 App Router, React 19, Framer Motion 11, Tailwind 4, TypeScript. "Framer" in the brief means Framer Motion.
- New runtime dependency allowed: `lenis` (smooth scroll). Nothing else beyond what is in `package.json` unless the builder justifies it in a line in the plan.
- Fonts via `next/font/google` only (no self-hosted licensed fonts).
- Keep `lib/content.ts` as the single source of strings; the grounding document in `lib/portfolio-context.ts` must still render from it and remain deterministic (prompt-cache stability).
- Routes stay: `/`, `/work`, `/about`, `/contact`, `/lab` (redirects to `/work`), `/api/ask`.
- Everything respects `prefers-reduced-motion`: scroll scenes resolve to their final state, canvas effects are not started, the preloader shows a still frame for ≤ 450 ms.

## 4. Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| 1 | **Reskin in place**: swap tokens, rename labels, replace preloader, keep components | Fast, but the Neural Arcade skeleton stays visible; fails the anti-goal | Rejected |
| 2 | **Rebuild the presentation layer on the existing shell**: keep app, content, API; replace tokens, type, every visual component; add smooth scroll, scroll scenes, page transitions | All effort lands on what the jury sees; backend already proven | **Chosen** |
| 3 | **Fresh app with WebGL** (Three.js crystals, volumetric smoke) | Highest ceiling, but the usual cause of poor mobile performance on portfolio sites; roughly doubles the build | Rejected |

Parth handed over the "how"; approach 2 is my call, stated to him before this doc.

## 5. The design

### 5.1 Concept
The site is **Parth's lab**. He is an applied AI engineer who runs it like a lab: precise, measured, no half measures. The periodic table is the type system. Projects are **batches** with a **purity** metric (their existing headline metric). Experiments are what came out of the RV. The ask bar is the lab's intercom. The whole thing sits in a desert at dusk: hot haze above, cold lab light below.

### 5.2 Visual language

**Palette** (tokens in `app/globals.css` `@theme`, replacing the current ones):

| Token | Role | Value (starting point, builder may tune in OKLCH) |
|---|---|---|
| `--color-tar` | page background | `#0b0c0a` |
| `--color-lab` | deep lab green, panels | `#0f2f25` |
| `--color-element` | tile green (the "Br" tile) | `#2f7a5a` |
| `--color-crystal` | blue crystal accent, links, highlights | `#7fdcf5` |
| `--color-hazmat` | yellow, CTAs, caution tape, active states | `#f2c230` |
| `--color-sand` | desert ochre, warm panels | `#c99a5b` |
| `--color-smoke` | muted text | `#9a9c93` |
| `--color-bone` | primary text | `#ece9df` |
| `--color-line` | hairlines | `#1f2320` |

Rule of use: tar everywhere, bone for type, element green and crystal blue carry the lab, hazmat yellow is rare and loud (one CTA per screen, the caution band, active nav), sand only in the RV/experiments scene and the about page. Violet and lime are removed.

**Type**
- Display: a heavy grotesque with condensed widths for poster-scale headlines. Builder's pick between `Archivo` (variable weight + width) and `Anton` + `Archivo`; either way the element tiles use a plain sans at `font-weight 500`, like the show's tiles.
- Body: `Archivo` 400/500.
- Lab labels: a mono (`IBM Plex Mono` or `JetBrains Mono`) in small caps-style uppercase with wide tracking: `§ 02 · BATCHES`, `PURITY 99.1%`, `BATCH 04 / 06`.
- Fluid scale: the existing `clamp()` approach in `globals.css` is kept; values re-tuned to the new faces.

**Element tile** (`components/ElementTile.tsx`): the signature component. A square with 2px bone border on element green, the symbol large, atomic number top-left, name small at bottom. Sizes `xs` (nav), `md` (tags), `xl` (hero/preloader). Any string can be rendered as a tile; a helper maps known strings to real elements (`P` 15 Phosphorus, `Ar` 18 Argon, `Th` 90 Thorium, `S` 16 Sulfur, `Pa` 91 Protactinium) and otherwise shows the first one or two letters with a made-up number. The stack renders as tiles: `Py` Python, `Rs` Rust, `Ts` TypeScript, `Tf`, `Lg` LangGraph, etc.

**Texture**: a fixed, pointer-events-none grain overlay (SVG `feTurbulence`, ~4% opacity, `mix-blend-mode: overlay`). A `components/Smoke.tsx` 2D canvas renders slow, noise-driven smoke plumes at low resolution (quarter-res, upscaled) behind the hero and the contact page only. Desktop only; off under reduced motion.

### 5.3 Global motion system

- **Smooth scroll** with `lenis`, wired into Framer Motion's `useScroll` (one `SmoothScroll` provider in `app/layout.tsx`). Disabled on touch devices and under reduced motion.
- **Page transitions** (`app/template.tsx` + `AnimatePresence`): a hazmat-yellow then lab-green double wipe from bottom to top on route change (~600 ms), the incoming page fades up underneath. Nav stays mounted.
- **Cursor** (`components/Cursor.tsx`, replaces NeuralCursor): a thin crystal-blue ring with a centre dot. Over interactive elements it grows into a labelled pill (`open ↗`, `reroll`, `filter`, `send`), the labels coming from the existing `data-cursor` attributes. Over images it inverts (`mix-blend-mode: difference`). Hidden on touch.
- **Reveal grammar**: section headings reveal by clip-path wipe from the bottom (not fade-up); paragraphs fade up 24px; tiles pop in with the existing `BOING` spring; images unmask with a clip-path inset. One `Reveal` component with a `kind` prop replaces the current one.
- **Magnetic** hover on primary buttons and nav items (`components/Magnetic.tsx`, ±8px pull).
- **Section stamps**: every section opens with a mono lab label in the top-left (`§ 01 · THE ENGINEER`) and a thin hairline that draws in on reveal.
- All timing constants live in `lib/motion.ts`.

### 5.4 Preloader — "The Reaction" (`components/Preloader.tsx`, replaces LoadingScreen)
Once per tab (existing `sessionStorage` logic kept, key renamed). Total ≤ 2.8 s.

```
t=0.0  black. a mono line types: "$ initiating reaction"
t=0.3  an Erlenmeyer flask outline draws in (SVG stroke-dashoffset)
t=0.8  liquid fills from the bottom, crystal blue, with 6–8 rising bubbles (SVG circles on eased paths)
t=1.5  a hazmat-yellow flash (full-screen opacity blip, 120 ms); smoke plume rises from the neck (canvas or 3 blurred ellipses)
t=1.7  four XL element tiles slam in one by one with a heavy spring and a 1-frame screen shake: [P][Ar][Th]  [S]
t=2.4  tiles settle into a row reading "P Ar Th   S ood" (the "ood" fades in as plain text, like "eaking" and "d" in the show logo)
t=2.8  the black backdrop fades; the four tiles stay and glide into their hero positions (shared `layoutId`, ~500 ms) — the hero is already rendered beneath
```
Reduced motion: still frame of the finished logo row, cleared at 450 ms.

### 5.5 Home page scenes, top to bottom

**Hero — "§ 00 · THE LAB"** (`components/Hero.tsx` + `TitleCard.tsx` + `Headline.tsx` rewritten)
- The hero *is* the title card. The name renders as element tiles at poster scale, the way the show's title does:

```
  ┌────┐┌────┐┌────┐
  │15  ││18  ││90  │
  │ P  ││ Ar ││ Th │
  └────┘└────┘└────┘
  ┌────┐
  │16  │ ood
  │ S  │
  └────┘
```
  `P` `Ar` `Th` are tiles on line one; line two is the `S` tile followed by "ood" in the display face (plain text, like "eaking" and "d" in the original). On desktop the two lines sit left-aligned, tiles roughly 1/5 of viewport width each; at 390px the tiles shrink so line one still fits in one row. The tiles are the ones the preloader slams in: on first load the preloader's tiles **hand off** to the hero's tiles with a shared `layoutId`, so the logo lands in place instead of the hero re-animating it. On later visits (no preloader) the tiles pop in with the `BOING` spring, staggered 90 ms.
- Hovering a tile flips it to show the element's full name and number (`Protactinium` style card back); clicking any tile plays a short crystal-blue shimmer across the row.
- Under the title card, the sub-headline at section scale (not poster scale):
  `Pure, applied AI. [word] of the time.` where `[word]` is the reroll slot (kept from today, now hazmat yellow, underlined with a dashed "measurement" rule). Variants: `99.1%`, `Most`, `All`, `Some`, `Enough`. Same layout-stability trick as today (invisible sizers). **Builder-check call:** the variants are deliberately short (longest is 6 characters) so the sizer trick holds at every width; the sub-headline is sized from `Enough of the time.` as the widest line.
- Beneath: the role line as a lab label: `APPLIED AI ENGINEER · ASPECT RATIO · PUNE` with a blinking caret.
- Right column (desktop): a slow-rotating field of 10–12 stack tiles in parallax (`useScroll` drives translateY at different rates; mouse position drives ±6px tilt). On mobile they become a single horizontal strip under the sub-headline.
- Background: `Smoke` canvas, a thin desert horizon line at ~78% height that the smoke sits above, grain on top.
- Scroll cue bottom-left: `scroll ↓` with the horizon line drawing out.

**Readouts — "§ 01 · READOUTS"** (`components/Readouts.tsx`, replaces TempSlider + ModelToys)
A single lab-instrument panel (lab green, hairline grid) with three instruments side by side (stacked on mobile):
1. **Purity dial** — a range input 0–99.1 rendered as a semicircular gauge with a needle. It drives the bio register exactly as the temperature slider does today (`bioFor` remapped: low purity = formal, 99.1 = unhinged, so the mapping is inverted from temperature on purpose: more purity, more Parth). The bio text swaps with a blur-crossfade.
2. **Contaminants toggle** — the hallucinations switch. Off: `contaminants: 0 ppm`. On: a tall tale from `HALLUCINATIONS` with the label `contaminant detected`.
3. **Yield bar** — the training bar. `+ precursor` adds 20%; messages become `batch: empty` → `reacting… 40%` → `yield: 100% (jk)`.

**Ask the lab — "§ 02 · INTERCOM"** (`components/AskBar.tsx` restyled, logic unchanged)
Input styled as a lab notebook line on a dark panel: `> ask the lab anything…`. Suggestion chips as `md` tiles. Streaming answer renders in mono, token by token as today, under a label `RESPONSE · GROUNDED` (or `· CANNED` on the fallback path). Full width, directly under the readouts.

**Caution band** (`components/CautionBand.tsx`, replaces Marquee)
Two full-bleed bands, rotated −2° and +1.5°, hazmat yellow with black diagonal stripes at the edges, carrying the `MARQUEE` skills in heavy black type. Scroll velocity drives marquee speed (`useVelocity`); the bands drift in opposite directions. Reduced motion: static.

**Batches — "§ 03 · BATCHES"** (`components/Batches.tsx`, replaces FeaturedGrid)
Desktop: a pinned horizontal scroll. The section is `300vh` tall; a sticky track translates the four featured projects horizontally as the user scrolls, with a mono progress label `BATCH 02 / 04` and a thin progress rule. Each batch card is a lab report: tall (`3:4`), lab-green panel, batch number stamped huge and faint behind, the project's metric as the **purity** readout in hazmat yellow (`−38%` with label `context tokens`), the project name, the one-liner, the stack as a row of `md` tiles, and the screenshot slot (`Hatch` placeholder or real image) tinted crystal blue that unmasks on hover. Click opens the repo.
Mobile: a vertical list of the same cards, no pinning.

**The RV — "§ 04 · EXPERIMENTS"** (`components/RvPanel.tsx`, replaces LabPanel)
A sand-coloured panel that scales 0.9 → 1 and rounds 48 → 24px on scroll (the existing effect, kept because it is good). Copy: `Not everything is a batch. Some of it was cooked up in the RV.` → change "cooked up" to `built in the RV` (anti-goal). CTA to `/work#experiments` as a magnetic hazmat button `open the RV ↗`. Four small lab entries listed inside as tiles + names.

**Footer** (`components/Footer.tsx` restyled)
Big send-off `Say my name.` (hover reveals `(it's Parth)` in mono), the three links, a stamp `99.1% PURE · NO HALF MEASURES · 2026`, and the existing footerNote.

### 5.6 Work page — "§ 03 · INVENTORY"
Keeps the merged `UnifiedGrid` (projects + experiments, six filters) because the merge is the uncommitted work Parth is mid-way through. Restyled:
- Heading `Inventory` at page scale with the count as a tile (`06`).
- Filters as `md` tiles; active filter is hazmat yellow. Filtering animates with `layout` + `popLayout` as now.
- Cards use the batch-card visual from 5.5 but at `16:10`. Experiments get a sand badge; projects get a crystal badge.
- Hover: a floating preview follows the cursor (reuse the follow logic from `WorkTable.tsx`), tinted crystal.
- `#experiments` anchor scrolls to the first experiment card and preselects the `Experiments` filter.

### 5.7 About page — "§ 01 · THE ENGINEER"
- Portrait (`components/PixelPortrait.tsx`): `public/portrait.jpg` rendered as **pixel art in the site palette**, inside a hazmat-yellow bracket frame (four L corners that draw in). The browser draws the photo to a canvas, downsamples it to a block grid, and quantises every block to the nearest of the site tokens (tar, lab, element, crystal, hazmat, sand, bone, smoke), so it reads as a sprite drawn in the show's colours — the deliberate contrast to the smooth, cinematic rest of the site. On scroll into view it *resolves*: 48px blocks sharpening to 6px over ~1 s, eased. Hover (or tap) crossfades to the real photo underneath; click toggles it to stay. Reduced motion: the 6px state, no resolve, hover still works. The quantised sprite is also exported once at build time (a small script in `scripts/`) to `public/icon.png` for the favicon and reused as a 24px stamp in the footer. If `portrait.jpg` is missing the frame holds the `Pa` tile composition from section 6. No hat, no glasses, no character props.
- Headline: `Part engineer, part prompt whisperer, full-time tinkerer.` Bio paragraph unchanged in substance.
- Stack as a periodic-table grid of tiles (a real 2-row layout, not pills). Hover lifts the tile and shows the full name.
- Principles (pinned-and-stacked cards, effect kept): `01 / prototype — Respect the chemistry` (lab green), `02 / measure — Know your purity` (hazmat), `03 / harden — No half measures` (sand). Bodies kept from today.
- Timeline becomes **Lab notebook**: mono dates on the left margin like notebook stamps, entries reveal line by line, a hairline "ruled paper" grid behind.

### 5.8 Contact page — "§ 05 · SAY MY NAME"
- Headline `Say` / `my name.` at contact scale, with the final word in hazmat. Under it the subline from today with "faster than most agents" kept.
- Links list unchanged structurally, restyled.
- Form unchanged in behaviour (mailto hand-off). Fields styled as notebook lines. Interest chips as tiles. Submit is the magnetic hazmat button `send it`. Success state copy: `Received. You're right — Parth.` with the token counter message kept.
- `Smoke` canvas behind, lighter than the hero.

### 5.9 Nav
Sticky, transparent until scrolled, then tar at 85% with blur (as now). Left: an `xs` tile `Pa` (91) followed by `rth` in display face — click still cycles the extension (`.sood`, `.dev`, …) rendered as a faint mono suffix. Right: pill nav (Home, Work, About); the active pill is hazmat yellow with the `layoutId` slide kept. **Builder-check call:** contact stays one click away as a separate button to the right of the pills, labelled `Say my name`, outlined in bone and filling hazmat only on hover, hidden on `/contact` (as today's "Say hi" button is). That keeps the one-loud-hazmat-per-screen rule: the active pill is the only solid hazmat in the nav. Mobile: a full-screen menu that wipes in lab green with items revealing by clip-path, contact as the last item.

### 5.10 Content changes (`lib/content.ts`)
Only labels and gag copy change; data does not. New/changed exports:
- `HEADLINE_WORDS` → the purity variants listed in 5.5.
- `HALLUCINATIONS` unchanged text; `MARQUEE` unchanged.
- `PRINCIPLES` titles updated per 5.7; `bg` values point at the new tokens.
- `trainMessage`, `tokenMessage` copy per 5.5.
- New `ELEMENTS` map (symbol → number, name) and `STACK_TILES` (stack string → symbol).
- `SITE.role` stays `applied_ai_engineer` for the grounding doc; a new `SITE.title = "Applied AI engineer"` (Parth asked on 2026-11-17 that the word chemist never describe him; the lab is the setting, he is the engineer running it) for display.
- `lib/portfolio-context.ts` output must stay byte-stable aside from the deliberate copy edits (it is the cached system prompt).

### 5.11 Accessibility and performance rules
- Every scroll scene has a `prefers-reduced-motion` branch that renders the end state.
- The canvas smoke runs at ≤ 30 fps, quarter resolution, pauses when its section is off-screen (`IntersectionObserver`), and is not mounted on touch devices.
- Fonts: at most three families, subsetted, `display: swap`.
- All interactive elements keep real focus styles (hazmat 2px outline offset 3px).
- The pinned horizontal scroll must be skippable: keyboard users tab straight through the cards.
- No layout shift from the headline reroll (existing sizer trick) or from the preloader (hero renders underneath from the start).

## 6. What is left to the builder
- Exact font choice between the named candidates; exact OKLCH tuning of the palette.
- Smoke algorithm (simplex noise vs. layered blurred circles) as long as the perf rules hold.
- Image handling, within this rule (**builder-check call**): Parth will supply images. Conventions: `public/work/<slug>.png` for projects, `public/lab/<slug>.png` for experiments (lab entries gain a `slug` field: `facility-compliance`, `finfun`, `pairs-trading`, `momacmo`), `public/portrait.jpg` for the portrait. Cards resolve their image from the slug at build time (a tiny `lib/assets.ts` helper that checks the file exists via `fs` in a server component, so no 404s and no manual `img` editing). Recommended sources: screenshots 1600×1000 PNG/WebP; portrait ≥ 1200×1500 JPG. Until the files land, no entry has an image, so the no-image state is the one a jury will see and must be designed, not hatched. Each batch/inventory card without an image renders a generated **spectrum plate**: a lab-green plate with the project's stack tiles arranged like a fragment of the periodic table, the batch number stamped faintly behind, and a thin crystal-blue "chromatogram" line generated deterministically from the project slug. When `img` is set, the plate is replaced by `next/image` with `object-cover` and the crystal tint/unmask hover; the pipeline (`sizes`, blur placeholder) is built once and used by both card ratios. The old `Hatch` component is deleted. The portrait follows the same rule: without a photo, the About page frame holds a large `Pa` tile composition rather than a hatched box; a real photo drops in via one prop.
- The precise easing/duration values, within the preloader's 2.8 s budget and the 600 ms transition budget.
- Component file naming and splitting, as long as the old components that are replaced are deleted, not left dead.
- Order of implementation; suggested: tokens + type + tile → nav + cursor + grain → preloader → hero + readouts → caution band → batches → RV + footer → work → about → contact → transitions + smooth scroll → perf/a11y pass.

## 7. Verification
- `npm run typecheck`, `npm run build`, `npm run lint` clean.
- Manual pass at 390px and 1440px in Chrome and Safari, with and without reduced motion.
- Lighthouse desktop ≥ 90 performance, ≥ 95 accessibility; mobile ≥ 75 performance.
- Ask bar still answers offline (canned) and online (Claude).
- Grep the built output for the words in the anti-goal list.
