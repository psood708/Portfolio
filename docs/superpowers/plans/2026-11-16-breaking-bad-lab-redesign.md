# "The Lab" Breaking Bad Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's entire presentation layer as "Parth's lab": element-tile typography, Breaking Bad palette, cinematic preloader, scroll-driven scenes, page transitions, pixel-art portrait, with the existing content and ask API untouched.

**Architecture:** Keep the Next.js 15 App Router shell, `lib/content.ts`, `lib/ask.ts`, `lib/portfolio-context.ts`, `lib/ratelimit.ts` and `app/api/ask/route.ts`. Replace tokens, fonts and every visual component. Server components resolve images from `public/` by slug; client components own all motion. Pure logic (element mapping, purity bands, chromatogram, colour quantisation) lives in `lib/` and is unit-tested with Vitest; visual work is verified by typecheck, build, and headless screenshots.

**Tech Stack:** Next.js 15, React 19, Framer Motion 11, Tailwind 4, TypeScript 5, `lenis` (new runtime dep), `vitest` (new dev dep, justified: the only test runner the repo has; needed for the pure helpers), `sharp` (already in `node_modules` via Next, used only by a build-time script).

**Spec:** `docs/superpowers/specs/2026-11-16-breaking-bad-lab-redesign-design.md`

**Working directory for every command:** `/Users/psood/MLops/Framer_Parth_BB`

## Global Constraints

- Palette tokens, exactly: `tar #0b0c0a`, `lab #0f2f25`, `element #2f7a5a`, `crystal #7fdcf5`, `hazmat #f2c230`, `sand #c99a5b`, `smoke #9a9c93`, `bone #ece9df`, `line #1f2320`. `lime`, `violet`, `ink`, `surface*`, `mute-*` tokens are removed.
- Fonts: `Archivo` (variable weight, `wdth` axis) for display + body; `IBM Plex Mono` 400/500 for lab labels. Two families, `display: "swap"`, latin subset.
- Vocabulary: the strings `cook`, `meth` never appear in `app/`, `components/`, `lib/` (case-insensitive). Lab status `cooking` becomes `reacting`.
- Hazmat yellow: one solid hazmat CTA per screen; active nav pill is the only solid hazmat in the nav.
- Every scroll scene and canvas has a `prefers-reduced-motion` branch rendering the end state; canvases never mount under reduced motion or on touch (`(hover: hover) and (pointer: fine)`).
- Preloader ≤ 2.8 s, page transition ≤ 600 ms, once-per-tab preloader via `sessionStorage` key `lab-intro`.
- Focus style everywhere: `outline: 2px solid var(--color-hazmat); outline-offset: 3px` on `:focus-visible`.
- `lib/portfolio-context.ts` must stay a module-level constant with deterministic output.
- Old components that are replaced are deleted in the same task, never left dead.
- Commit after every task with plain messages. No co-author trailer: Parth is the sole author.

## Review Focus

1. **Second visit in the same tab** (preloader skipped): the hero tiles must still appear (BOING pop-in), not stay hidden waiting for a handoff. → Task 6 test `intro.test.ts` + manual step in Task 7.
2. **Touch device at 390px**: no cursor, no smoke, no pinned horizontal scroll; batches render as a vertical list; the hero line one still fits three tiles in one row. → Task 12 screenshot at 390 and Task 19 audit.
3. **Hash navigation `/work#experiments`** arriving directly (not from the RV button): the filter must preselect Experiments and scroll. → Task 14 test and manual step.
4. **Missing `portrait.jpg`**: About page and favicon must still build and render the `Pa` composition, and the icon script must exit 0 without writing. → Task 15 test `make-icon` dry-run and `assets.test.ts`.
5. **Ask bar offline**: with the dev server's route failing or no key, the streamed canned answer must still render under the `RESPONSE · CANNED` label. → Task 9 manual verification with `ANTHROPIC_API_KEY` unset.

---

### Task 0: Baseline commit, Vitest, Lenis

**Files:**
- Modify: `package.json` (scripts `test`, devDependency `vitest`, dependency `lenis`)
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest on `tests/**/*.test.ts`; alias `@/` resolves to repo root in tests.

- [ ] **Step 1: Commit the carried-over working tree as the baseline**

```bash
git add -A && git commit -m "chore: carry over unified work grid and design docs as baseline"
```

- [ ] **Step 2: Install dependencies**

Run: `npm install lenis@^1.3.27 && npm install -D vitest@^5`
Expected: both appear in `package.json`; `npm ls lenis vitest` shows no errors.

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

Add `"test": "vitest run"` to `package.json` scripts.

- [ ] **Step 4: Write `tests/smoke.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/content";
describe("smoke", () => { it("imports content", () => expect(SITE.name).toBe("Parth Sood")); });
```

- [ ] **Step 5: Run tests and typecheck**

Run: `npm test && npm run typecheck`
Expected: 1 passed; typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add vitest and lenis"
```

---

### Task 1: Tokens, fonts, global CSS, motion constants

**Files:**
- Rewrite: `app/globals.css`
- Modify: `app/layout.tsx` (fonts only in this task)
- Modify: `lib/motion.ts`

**Interfaces:**
- Produces CSS tokens (Tailwind utilities): `bg-tar text-bone bg-lab bg-element text-crystal bg-hazmat bg-sand text-smoke border-line`, `font-display`, `font-mono`, `ease-boing`; fluid text sizes `text-title` (tile size var), `text-sub` (hero sub-headline), `text-page`, `text-contact`, `text-about`, `text-section`, `text-panel`, `text-sendoff`; utility classes `.grain`, `.caution-stripes`, `.notebook-rules`, `.caret-blink`, `.lab-label` (mono, uppercase, `letter-spacing: 0.18em`, `font-size: 11px`).
- Produces CSS vars: `--tile: clamp(96px, 26vw, 212px)` (XL tile edge), `--text-sub: clamp(1.75rem, 1.2rem + 2.6vw, 3.75rem)`.
- Produces in `lib/motion.ts`: `BOING`, `EASE_OUT`, `EASE_WIPE = [0.76, 0, 0.24, 1]`, `DUR = { tile: 0.5, wipe: 0.6, reveal: 0.7, preloader: 2.8 }`, variants `fadeUp`, `clipUp` (`clipPath: inset(100% 0 0 0)` → `inset(0 0 0 0)`), `maskIn` (`clipPath: inset(8% 8% 8% 8% round 16px)` → `inset(0 round 16px)`), `cascade(stagger)`, `viewportOnce`, `tokenStream`, `tokenChild`.

- [ ] **Step 1: Rewrite `app/globals.css`**

`@theme` holds the nine colour tokens from Global Constraints, the two font vars (`--font-display: var(--font-archivo)`, `--font-mono: var(--font-plex-mono)`), `--ease-boing: cubic-bezier(0.3, 1.6, 0.5, 1)`, the fluid scale, and `--tile`. `@layer base`: `html { background: var(--color-tar) }`, `body { color: var(--color-bone); font-family: var(--font-display) }`, `a { color: inherit; text-decoration: none }`, `:focus-visible { outline: 2px solid var(--color-hazmat); outline-offset: 3px }`, `::selection { background: var(--color-hazmat); color: var(--color-tar) }`. Utilities: `.grain` (fixed full-screen `<svg>` background via `url("data:image/svg+xml,...feTurbulence baseFrequency=0.9 numOctaves=2...")`, `opacity: .045`, `mix-blend-mode: overlay`, `pointer-events: none`, `z-index: 60`), `.caution-stripes` (`repeating-linear-gradient(135deg, var(--color-hazmat) 0 18px, var(--color-tar) 18px 36px)`), `.notebook-rules` (`repeating-linear-gradient(to bottom, transparent 0 31px, var(--color-line) 31px 32px)`), `.lab-label`, `.caret-blink` (kept), `html.has-cursor * { cursor: none !important }` under the fine-pointer media query, `.purity-range` slider styles (thumb hazmat 14px, track `--color-line` 3px), and the reduced-motion block disabling `.caret-blink` and any CSS keyframes.

- [ ] **Step 2: Swap fonts in `app/layout.tsx`**

```ts
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
```
Apply both variables on `<html>`. Update `viewport.themeColor` to `#0b0c0a`. Metadata title stays; description changes to `Chemist of applied AI. Clinical NLP and cohort pipelines by day; vector indexes, agent systems and the evals that keep them honest by night.`

- [ ] **Step 3: Update `lib/motion.ts`** with the exports listed in Interfaces (keep the existing ones that are listed, add the new ones, delete `revealVariants`).

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run build`
Expected: both clean (old components still compile; unknown utilities emit nothing).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(theme): lab palette, Archivo + Plex Mono, motion constants"
```

---

### Task 2: Elements and the ElementTile

**Files:**
- Create: `lib/elements.ts`
- Create: `components/ElementTile.tsx`
- Test: `tests/elements.test.ts`

**Interfaces:**
- Produces `lib/elements.ts`:
  - `type Element = { symbol: string; number: number; name: string }`
  - `ELEMENTS: Record<string, Element>` containing at least `P 15 Phosphorus`, `Ar 18 Argon`, `Th 90 Thorium`, `S 16 Sulfur`, `Pa 91 Protactinium`, `Py 0 Python`, `Rs 0 Rust`, `Ts 0 TypeScript`, `Ps 0 PySpark`, `Pt 78 PyTorch`, `Bb 0 BioBERT`, `Lg 0 LangGraph`, `Fa 0 FastAPI`, `Nx 0 Next.js`, `Pg 0 PostgreSQL`, `Aw 0 AWS`, `Dk 0 Docker`, `Ag 47 Agents`, `Rg 0 RAG`, `Ev 0 Evals`, `Sy 0 Systems`, `Ex 0 Experiments`.
  - `NAME_TILES: readonly Element[]` = `[P, Ar, Th, S]`; `LOGO_TILE: Element` = `Pa`.
  - `STACK_TILES: Record<string, string>` mapping each `STACK` label and each `Tag` to a symbol.
  - `tileFor(label: string): Element` — returns `ELEMENTS[STACK_TILES[label] ?? label]` if present, else `{ symbol: first two letters capitalised-then-lower, number: stable hash of label mod 100 + 100, name: label }`.
  - `stackSymbols(stack: string): string[]` — splits a `Project.stack` string on `·`, trims, maps with `tileFor`, returns symbols, max 5.
- Produces `components/ElementTile.tsx`: `ElementTile({ element, size = "md", tone = "element", flip = false, layoutId, className, onClick })` with `size: "xs" | "md" | "xl"`, `tone: "element" | "hazmat" | "sand" | "crystal" | "outline"`. `xl` uses `--tile` for its edge, `md` is 44px, `xs` is 28px. Renders `number` top-left, `symbol` centred, `name` bottom (hidden on `xs`). When `flip` is true the tile is a 3D flip card whose back shows `name` and `number` large; hover flips. Accepts `layoutId` and forwards it to the outer `motion.div`.

- [ ] **Step 1: Write `tests/elements.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { ELEMENTS, NAME_TILES, LOGO_TILE, tileFor, stackSymbols } from "@/lib/elements";
import { STACK, FILTERS } from "@/lib/content";
describe("elements", () => {
  it("spells the name with real elements", () => {
    expect(NAME_TILES.map((e) => `${e.symbol}${e.number}`)).toEqual(["P15", "Ar18", "Th90", "S16"]);
    expect(LOGO_TILE).toEqual({ symbol: "Pa", number: 91, name: "Protactinium" });
  });
  it("maps every stack label and filter to a tile", () => {
    for (const s of [...STACK, ...FILTERS.filter((f) => f !== "All")]) {
      const t = tileFor(s); expect(t.symbol.length).toBeLessThanOrEqual(2); expect(t.name).toBeTruthy();
    }
  });
  it("is deterministic and bounded for unknown labels", () => {
    expect(tileFor("Axum")).toEqual(tileFor("Axum"));
    expect(tileFor("Axum").number).toBeGreaterThanOrEqual(100);
    expect(tileFor("Axum").symbol).toBe("Ax");
  });
  it("splits a stack string into at most five symbols", () => {
    expect(stackSymbols("Rust · Axum · Rayon · mmap")).toEqual(["Rs", "Ax", "Ra", "Mm"]);
    expect(stackSymbols("a · b · c · d · e · f")).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test` → FAIL, module not found.
- [ ] **Step 3: Implement `lib/elements.ts`** per Interfaces. Hash: `[...label].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 100 + 100`.
- [ ] **Step 4: Run tests** — `npm test` → PASS.
- [ ] **Step 5: Implement `components/ElementTile.tsx`** per Interfaces. Tile face: `border: 2px solid var(--color-bone)`, background by tone (`element` → `--color-element`, `hazmat` → hazmat with tar text, `sand`, `crystal` with tar text, `outline` → transparent with bone border), inner padding 7% of the edge, number at `0.13em` of edge in mono, symbol at `0.5em` in `font-display` weight 500, name at `0.075em`. Use `style={{ "--edge": ... }}` and `font-size: var(--edge)` so children scale by `em`. Flip: outer `perspective: 900px`, inner `motion.div` `whileHover={{ rotateY: 180 }}` with `transformStyle: preserve-3d`, back face `rotateY(180deg)` `backface-visibility: hidden`.
- [ ] **Step 6: Typecheck** — `npm run typecheck` → clean.
- [ ] **Step 7: Commit** — `feat(ui): element map and ElementTile`.

---

### Task 3: Content copy changes

**Files:**
- Modify: `lib/content.ts`
- Modify: `lib/portfolio-context.ts` (only if `status` rename changes a type)
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces in `lib/content.ts`:
  - `SITE.title = "Chemist of applied AI"`; `SITE.roleLine = "CHEMIST · APPLIED AI · ASPECT RATIO · PUNE"`; `SITE.stamp = "99.1% PURE · NO HALF MEASURES"`.
  - `HEADLINE_WORDS = ["99.1%", "Most", "All", "Some", "Enough"]`.
  - `PURITY_MAX = 99.1`; `PURITY_DEFAULT = 99.1`; `bioForPurity(p: number): string` → `p >= 99` → `BIO_REGISTERS[2]`, `p >= 85` → `[1]`, `p >= 50` → `[0]`, else `[3]` (builder's call: dropping purity degrades the bio; 99.1 is the playful-but-sharp one).
  - `purityLabel(p: number): string` → `p >= 99 ? "lab grade" : p >= 85 ? "clean" : p >= 50 ? "cut" : "contaminated"`.
  - `trainMessage(pct)` → `0: "batch: empty"`, `100: "yield: 100% (jk)"`, else `` `reacting… ${pct}%` ``.
  - `tokenMessage` unchanged.
  - `LabEntry.status: "shipped" | "reacting" | "broke it"`, `LabEntry.slug` added (`facility-compliance`, `finfun`, `pairs-trading`, `momacmo`); `rot` kept.
  - `PRINCIPLES` titles → `Respect the chemistry`, `Know your purity`, `No half measures`; `bg` → `var(--color-element)`, `var(--color-hazmat)`, `var(--color-sand)`; add `fg` → `var(--color-bone)`, `var(--color-tar)`, `var(--color-tar)`.
  - `NAV` unchanged. `CONTACT_LABEL = "Say my name"`.
  - `RV_COPY = { title: "Not everything is a batch.", sub: "Some of it was built in the RV.", cta: "open the RV ↗" }`.
  - `FOOTER = { sendoff: "Say my name.", aside: "(it’s Parth)" }`.

- [ ] **Step 1: Write `tests/content.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import * as C from "@/lib/content";
import { PORTFOLIO_CONTEXT } from "@/lib/portfolio-context";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p; });
describe("content", () => {
  it("purity bands", () => {
    expect(C.bioForPurity(99.1)).toBe(C.BIO_REGISTERS[2].text);
    expect(C.bioForPurity(90)).toBe(C.BIO_REGISTERS[1].text);
    expect(C.bioForPurity(60)).toBe(C.BIO_REGISTERS[0].text);
    expect(C.bioForPurity(10)).toBe(C.BIO_REGISTERS[3].text);
    expect(C.purityLabel(99.1)).toBe("lab grade");
  });
  it("yield copy", () => {
    expect(C.trainMessage(0)).toBe("batch: empty");
    expect(C.trainMessage(40)).toBe("reacting… 40%");
    expect(C.trainMessage(100)).toBe("yield: 100% (jk)");
  });
  it("headline variants are short", () => {
    expect(C.HEADLINE_WORDS).toEqual(["99.1%", "Most", "All", "Some", "Enough"]);
    for (const w of C.HEADLINE_WORDS) expect(w.length).toBeLessThanOrEqual(6);
  });
  it("lab entries have slugs and no banned status", () => {
    expect(C.LAB.map((l) => l.slug)).toEqual(["facility-compliance", "finfun", "pairs-trading", "momacmo"]);
    for (const l of C.LAB) expect(["shipped", "reacting", "broke it"]).toContain(l.status);
  });
  it("grounding doc is stable and still mentions every project", () => {
    for (const p of C.PROJECTS) expect(PORTFOLIO_CONTEXT).toContain(p.name);
    expect(PORTFOLIO_CONTEXT).not.toMatch(/cook/i);
  });
  it("no drug vocabulary anywhere in source", () => {
    for (const dir of ["app", "components", "lib"]) for (const f of walk(dir)) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/\b(cook|cooking|cooked|meth)\b/i);
    }
  });
});
```

- [ ] **Step 2: Run** — `npm test` → FAIL (`bioForPurity` missing; banned-word test fails on `LabPanel`/`content`).
- [ ] **Step 3: Edit `lib/content.ts`** per Interfaces. Keep `bioFor` exported (unused later; delete in Task 8). Replace the `cooking` status. Remove nothing else.
- [ ] **Step 4: Run** — `npm test` → the banned-word test may still fail on old components that say "cook" (check with `grep -rniE "\b(cook|meth)" app components lib`). Fix only `lib/`; leave component hits for the tasks that delete them, and mark that test `it.todo` until Task 13 if needed — **no**: instead change the old `LabPanel` copy now to `built` so the suite is green at every commit.
- [ ] **Step 5: Verify** — `npm test && npm run typecheck` → green.
- [ ] **Step 6: Commit** — `feat(content): lab vocabulary, purity bands, slugs`.

---

### Task 4: Global chrome — Grain, Cursor, Magnetic, SectionStamp, Reveal, SmoothScroll

**Files:**
- Create: `components/Grain.tsx`, `components/Cursor.tsx`, `components/Magnetic.tsx`, `components/SectionStamp.tsx`, `components/SmoothScroll.tsx`
- Rewrite: `components/Reveal.tsx`
- Delete: `components/NeuralCursor.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- `Grain()` — renders `<div aria-hidden className="grain" />`.
- `Cursor()` — port of `NeuralCursor` with: ring 28px, border `1.5px solid var(--color-crystal)`, dot 4px crystal; labelled state becomes a hazmat pill with tar mono text; adds class `has-cursor` on `<html>`; over `[data-cursor-invert]` the ring switches to `mix-blend-mode: difference` white. Gate: fine pointer and not reduced motion.
- `Magnetic({ children, strength = 8, className })` — wraps one child in a `motion.div` that follows the pointer within its bounds by up to `strength` px (spring `BOING`), resets on leave.
- `SectionStamp({ index, label, className })` — renders `<div className="lab-label">§ {index} · {label}</div>` plus a hairline that scales X 0→1 on `whileInView`.
- `Reveal({ kind = "fade", delay, as = "div", ...rest })` with `kind: "fade" | "wipe" | "mask"` selecting `fadeUp | clipUp | maskIn` variants.
- `SmoothScroll({ children })` — `ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}` from `lenis/react`, but returns plain children when `matchMedia("(hover: none)")` matches or reduced motion is on (state resolved in an effect; initial render plain).
- `app/layout.tsx` body order: `MotionProvider > SmoothScroll > [Grain, Cursor, Nav, main, Footer]`. `LoadingScreen` stays mounted until Task 6 replaces it.

- [ ] **Step 1: Create the five components** per Interfaces. Cursor keeps the rAF loop and `data-cursor` label lookup from `NeuralCursor.tsx` verbatim; only styling and class names change.
- [ ] **Step 2: Rewrite `Reveal.tsx`**; update every import of `Reveal` (`app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `Footer.tsx`) — they compile unchanged because `kind` defaults to `fade`.
- [ ] **Step 3: Wire `app/layout.tsx`**, delete `NeuralCursor.tsx`, replace `has-neural-cursor` in CSS with `has-cursor` (done in Task 1 already; confirm).
- [ ] **Step 4: Verify** — `npm run typecheck && npm run build && npm test`.
- [ ] **Step 5: Visual check** — start `npm run dev` in background, screenshot with the headless shell:
  `~/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --screenshot=/private/tmp/claude-501/-Users-psood-MLops-Framer-Parth/e7b18480-aad6-45b1-b6f7-51a5392551a2/scratchpad/t4.png --window-size=1440,900 --hide-scrollbars http://localhost:3000/`
  Expected: page renders on tar background with grain; no console errors in dev output.
- [ ] **Step 6: Commit** — `feat(chrome): grain, crystal cursor, magnetic, section stamps, lenis`.

---

### Task 5: Nav

**Files:**
- Rewrite: `components/Nav.tsx`

**Interfaces:**
- Consumes `ElementTile`, `LOGO_TILE`, `Magnetic`, `NAV`, `CONTACT_LABEL`, `EXTENSIONS`.
- Produces `Nav()`; exposes nothing else. Mobile menu: full-screen fixed panel `bg-lab`, enters with `clipPath: inset(100% 0 0 0)` → `inset(0)` over 500 ms `EASE_WIPE`, items reveal with `clipUp` staggered 60 ms, contact as last item; body scroll locked while open; closes on route change.

- [ ] **Step 1: Rewrite `Nav.tsx`**: left = `<button>` with `ElementTile size="xs" element={LOGO_TILE}` + `rth` in display 600 + extension suffix in mono `text-smoke`. Centre = pill nav with `layoutId="nav-pill"` hazmat active pill, tar text when active, `Magnetic` around each link (strength 6). Right = `Link` to `/contact` labelled `CONTACT_LABEL`, `border border-bone/40 rounded-full`, `hover:bg-hazmat hover:text-tar`, hidden when `pathname === "/contact"`. Header background transparent until `scrollY > 24` (use `useScroll().scrollY` + `useMotionValueEvent`), then `bg-tar/85 backdrop-blur-md border-b border-line`.
- [ ] **Step 2: Verify** — typecheck, screenshot at 1440 and 390 (`--window-size=390,844`). Expected: tile logo visible, pills, button hidden at 390 with ☰ present.
- [ ] **Step 3: Commit** — `feat(nav): tile logo, hazmat pill, say-my-name button, wipe menu`.

---

### Task 6: Intro context and Preloader

**Files:**
- Create: `lib/intro.ts` (pure), `components/IntroProvider.tsx`, `components/Preloader.tsx`
- Delete: `components/LoadingScreen.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/intro.test.ts`

**Interfaces:**
- `lib/intro.ts`: `INTRO_KEY = "lab-intro"`, `INTRO_MS = 2800`, `INTRO_CALM_MS = 450`, `TILE_AT = [1700, 1900, 2100, 2350]` (ms each name tile slams), `shouldPlayIntro(storage: Pick<Storage, "getItem"> | null): boolean` (false if `storage?.getItem(INTRO_KEY) === "1"`, true otherwise including when storage is null or throws), `markIntroSeen(storage)`.
- `IntroProvider`: context `{ phase: "pending" | "playing" | "done" }`; `pending` on the server and first client render, resolved in an effect to `playing` or `done`; `useIntro()` hook. Children render immediately in every phase.
- `Preloader`: renders only while `phase === "playing"`: the timeline from spec 5.4 (typed line, flask stroke draw, crystal fill with 7 bubbles, hazmat flash at 1500 ms, name tiles via `ElementTile size="xl" layoutId={"tile-" + symbol}` appearing at `TILE_AT`, "ood" fading in at 2400 ms), then sets phase `done` at `INTRO_MS` (or `INTRO_CALM_MS` with a still frame under reduced motion). Locks body scroll while playing. The overlay backdrop fades out over 500 ms, tiles persist via `layoutId` into the hero (Task 7).

- [ ] **Step 1: Write `tests/intro.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { shouldPlayIntro, markIntroSeen, INTRO_KEY, INTRO_MS, TILE_AT } from "@/lib/intro";
describe("intro", () => {
  it("plays once per storage", () => {
    const store = new Map<string, string>();
    const s = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
    expect(shouldPlayIntro(s)).toBe(true); markIntroSeen(s);
    expect(store.get(INTRO_KEY)).toBe("1"); expect(shouldPlayIntro(s)).toBe(false);
  });
  it("plays when storage is unavailable", () => {
    expect(shouldPlayIntro(null)).toBe(true);
    expect(shouldPlayIntro({ getItem: () => { throw new Error("private"); } })).toBe(true);
  });
  it("fits the budget", () => { expect(INTRO_MS).toBeLessThanOrEqual(2800); expect(Math.max(...TILE_AT)).toBeLessThan(INTRO_MS); });
});
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement `lib/intro.ts`.** **Step 4: Run** → PASS.
- [ ] **Step 5: Implement `IntroProvider.tsx` and `Preloader.tsx`**; mount `IntroProvider` inside `MotionProvider` in layout and `Preloader` before `Nav`; delete `LoadingScreen.tsx`. Flask: a single `<path>` outline, `pathLength` animated 0→1 (300–800 ms); liquid: `<rect>` clipped to the flask path, `y` animated bottom→60% (800–1500 ms); bubbles: 7 `<circle r=2..4>` each animating `cy` upward with `delay i*90ms`, `repeat: Infinity` until flash; flash: full-screen `motion.div bg-hazmat` opacity `[0,1,0]` over 120 ms at 1500 ms; screen shake: wrapper `x: [0,-6,5,-3,0]` 180 ms at each `TILE_AT`.
- [ ] **Step 6: Verify** — typecheck; dev screenshot immediately after load with `--virtual-time-budget=1200` (mid-intro: flask visible) and with `--virtual-time-budget=4000` (intro gone). Confirm `sessionStorage` semantics by reasoning (headless shell is a fresh profile per run).
- [ ] **Step 7: Commit** — `feat(intro): the reaction preloader`.

---

### Task 7: Hero — TitleCard, sub-headline, TileField, Smoke

**Files:**
- Create: `components/TitleCard.tsx`, `components/TileField.tsx`, `components/Smoke.tsx`, `components/Hero.tsx`
- Rewrite: `components/Headline.tsx`
- Modify: `app/page.tsx` (hero section only)

**Interfaces:**
- `TitleCard()` — two rows: `[P][Ar][Th]` and `[S] ood`. Uses `useIntro()`: while `phase !== "done"` renders invisible sizers only (same dimensions, `visibility: hidden`) so the hero holds its space; when `done` renders `ElementTile size="xl" flip layoutId={"tile-" + symbol}`. If the intro did not play this visit (`phase` went `pending → done` without `playing`), tiles use `initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}` with `BOING` and 90 ms stagger. Click on any tile: a crystal shimmer (`linear-gradient` sweep via a `motion.span` translated across the row, 700 ms).
- `Headline()` — the sub-headline: `Pure, applied AI.` then `[word] of the time.` with the reroll slot, hazmat word, dashed underline `border-bottom: 3px dashed color-mix(in oklch, var(--color-hazmat) 50%, transparent)`, invisible sizers for all five words, auto-reroll 2 s (reduced-motion → click only). `font-size: var(--text-sub)`.
- `TileField({ symbols: string[] })` — desktop-only absolute field (12 `md` tiles) positioned on a 4×3 jittered grid; each has `useTransform(scrollYProgress, [0,1], [0, -depth])` with `depth ∈ {40, 80, 120}`; pointer tilt ±6px via `useMotionValue` on `pointermove` over the hero. Mobile: a horizontal `overflow-x-auto` strip.
- `Smoke({ intensity = 1, className })` — `<canvas>` at quarter resolution, 6–9 plumes drawn as radial-gradient blobs (`bone` at 6% alpha × intensity) drifting upward with sin-based wobble; 30 fps cap via timestamp delta; `IntersectionObserver` pauses off-screen; returns `null` under reduced motion or `(hover: none)`.
- `Hero()` — composes `SectionStamp index="00" label="THE LAB"`, `TitleCard`, `Headline`, role line (`SITE.roleLine` in `.lab-label` + `.caret-blink`), `TileField symbols={STACK.map(s => tileFor(s).symbol)}`, `Smoke`, horizon line at `top: 78%` (`motion.div` `scaleX 0→1`, origin left, 1.2 s), and `scroll ↓` cue.

- [ ] **Step 1: Implement the five components** per Interfaces.
- [ ] **Step 2: Replace the hero `<section>` in `app/page.tsx`** with `<Hero />`; remove `TempSlider`, `ModelToys` from the hero (they are deleted next task; leave their imports out now and temporarily render nothing in their place).
- [ ] **Step 3: Verify** — typecheck/build/test; screenshots at 1440 and 390 with `--virtual-time-budget=5000`. Expected at 390: three tiles on one row, "S ood" on the second, sub-headline below without horizontal overflow (check `document.documentElement.scrollWidth <= 390` by adding `--dump-dom` and grepping is not possible; instead eyeball the screenshot for a clipped right edge).
- [ ] **Step 4: Manual second-visit check** — in the dev output confirm no React key/layout warnings; reason through `phase` path `pending → done` producing BOING pop-in (Review Focus 1).
- [ ] **Step 5: Commit** — `feat(hero): title card, purity sub-headline, tile field, smoke`.

---

### Task 8: Readouts

**Files:**
- Create: `components/Readouts.tsx`, `components/PurityDial.tsx`
- Delete: `components/TempSlider.tsx`, `components/ModelToys.tsx`
- Modify: `app/page.tsx`, `lib/content.ts` (delete `bioFor`)

**Interfaces:**
- `PurityDial({ value, onChange })` — a 180° SVG gauge (arc stroke `line`, filled arc `crystal` proportional to `value / PURITY_MAX`, needle rotates `-90° → +90°`, hazmat tick at 99.1), overlaid by an invisible-but-focusable `<input type="range" min=0 max=99.1 step=0.1 className="purity-range">` for input/a11y with `aria-valuetext={`purity ${value.toFixed(1)} percent, ${purityLabel(value)}`}`. Readout below: `value.toFixed(1)%` in display 700 + `purityLabel` in `.lab-label`.
- `Readouts()` — `SectionStamp index="01" label="READOUTS"`, a `bg-lab border border-line rounded-[28px]` panel with hairline grid background, three columns (`md:grid-cols-[1.2fr_1fr_1fr]`, stacked on mobile): PurityDial + bio (`bioForPurity`, blur-crossfade `filter: blur(6px)`→0, `min-h` locked), Contaminants toggle (`role="switch"`, off label `contaminants: 0 ppm`, on label `contaminant detected` + tale), Yield bar (`+ precursor` button, `trainMessage`, bar fill hazmat).

- [ ] **Step 1: Implement**, delete the two old components, remove `bioFor` from `content.ts`, render `<Readouts />` directly under `<Hero />`.
- [ ] **Step 2: Verify** — `npm test` (purity tests still pass), typecheck, screenshot 1440/390 scrolled to the panel (`--window-size=1440,2200` full-page approximations are acceptable).
- [ ] **Step 3: Commit** — `feat(readouts): purity dial, contaminants, yield`.

---

### Task 9: Ask the lab

**Files:**
- Modify: `components/AskBar.tsx` (styling + labels only)
- Modify: `app/page.tsx`

**Interfaces:**
- Keeps all fetch/stream logic. Visual: wrapper `SectionStamp index="02" label="INTERCOM"`; form is a notebook line (`border-b border-line`, no pill), prefix `>` in crystal, placeholder `ask the lab anything…`, submit button `Magnetic` hazmat `ask ↵`; suggestions as `ElementTile size="md" tone="outline"` + label; answer panel `bg-lab` with header `.lab-label` `RESPONSE · GROUNDED` or `RESPONSE · CANNED`, mono body, crystal caret while streaming.

- [ ] **Step 1: Restyle**; place `<AskBar />` full-width under `<Readouts />`.
- [ ] **Step 2: Verify offline path (Review Focus 5)** — run dev with `ANTHROPIC_API_KEY=` empty: `curl -s -X POST localhost:3000/api/ask -H 'content-type: application/json' -d '{"question":"What have you shipped?"}' -D - | head -5` → header `x-ask-source: canned`; screenshot after submitting is not scriptable here, so confirm the label logic by reading the component once.
- [ ] **Step 3: Commit** — `feat(ask): intercom styling`.

---

### Task 10: Caution band

**Files:**
- Create: `components/CautionBand.tsx`
- Delete: `components/Marquee.tsx`
- Modify: `app/page.tsx`, `app/globals.css` (remove marquee keyframes)

**Interfaces:**
- `CautionBand()` — two full-bleed bands (`w-[120vw] -ml-[10vw]`), rotated `-2deg` and `1.5deg`, `bg-hazmat text-tar`, with `.caution-stripes` 36px end caps; each band is a `motion.div` whose `x` is a `useMotionValue` advanced every frame by `baseSpeed ± scrollVelocity * k` (`useVelocity(scrollY)`, clamp `|v| ≤ 2000`, k = 0.004), opposite directions, content duplicated for wrap; text `MARQUEE` items in display 800 uppercase `wdth 75` at `clamp(28px, 4vw, 56px)` separated by `⚠`. Reduced motion: static, no rAF. `sr-only` list kept.

- [ ] **Step 1: Implement**, delete `Marquee.tsx`, remove `.marquee-*` CSS, render between `AskBar` and the batches section.
- [ ] **Step 2: Verify** — typecheck, screenshot.
- [ ] **Step 3: Commit** — `feat(band): caution tape marquee driven by scroll velocity`.

---

### Task 11: Assets, chromatogram, SpectrumPlate, Shot, BatchCard

**Files:**
- Create: `lib/assets.ts`, `lib/chromatogram.ts`, `components/SpectrumPlate.tsx`, `components/Shot.tsx`, `components/BatchCard.tsx`
- Delete: `components/Hatch.tsx` (and its `.hatch` CSS)
- Test: `tests/assets.test.ts`, `tests/chromatogram.test.ts`

**Interfaces:**
- `lib/assets.ts` (server-only; `import "server-only"` is not installed — use a top-of-file comment and only import from server components): `projectImage(slug: string, root = process.cwd()): string | null` → `/work/${slug}.png` if `${root}/public/work/${slug}.png` exists (also accepts `.webp`, `.jpg`, checked in that order), else `null`; `labImage(slug, root)` same for `/lab/`; `portraitImage(root)` → `/portrait.jpg` | `/portrait.png` | `null`; `pixelStamp(root)` → `/pixel-portrait.png` | `null`.
- `lib/chromatogram.ts`: `chromatogramPath(seed: string, width: number, height: number, peaks = 7): string` — deterministic SVG path `d` from a hash of `seed`: baseline at `0.82 * height`, `peaks` Gaussian-ish bumps at hashed x positions with hashed heights `0.15–0.7 * height`, built from quadratic segments; same input → same string.
- `SpectrumPlate({ seed, symbols, number, className })` — `bg-lab` plate, the `number` stamped at `font-size: 9em`-ish, `color-mix(bone 6%)`, bottom-right; `symbols` as `md` tiles arranged on a 4-column periodic fragment (second row offset); `<svg>` chromatogram in crystal 1.5px stroke with `pathLength` draw 0→1 on `whileInView`.
- `Shot({ src, alt, seed, symbols, number, ratio, sizes, className })` — if `src`: `next/image fill object-cover` under a crystal tint overlay (`bg-crystal mix-blend-multiply opacity-60`) that fades to 0 on `group-hover`, wrapped in `Reveal kind="mask"`; else `SpectrumPlate`. Container `data-cursor-invert`.
- `BatchCard({ project, index, image, ratio = "3/4", kind = "batch" | "experiment", badge })` — lab-report card: `bg-lab border border-line rounded-[24px]`, header row (`.lab-label` `BATCH 0${index+1}` + year), huge faint number behind, `Shot`, metric in hazmat display 800 with `metricLabel` under it in `.lab-label`, name (display 600 `text-2xl md:text-3xl`), one-liner (`text-smoke`), stack tiles row (`stackSymbols(project.stack)`), whole card is an `<a target=_blank>` with `data-cursor="open ↗"`. Accepts a `LabEntry` too via a normalised `CardData` type: `{ key, slug, kind: "batch" | "experiment", name, line, metric?, metricLabel?, stack?, year, href, badge, badgeTone: "crystal" | "sand", filters: string[] }`. Export `type CardData` and `toCard(project | lab): CardData`.

- [ ] **Step 1: Write `tests/chromatogram.test.ts`** — deterministic for the same seed, differs across seeds, starts with `M 0`, contains `peaks` `Q` segments count ≥ `peaks`.
- [ ] **Step 2: Write `tests/assets.test.ts`** — uses `mkdtempSync` to create `public/work/x.png`, asserts `projectImage("x", tmp) === "/work/x.png"`, `projectImage("y", tmp) === null`, `portraitImage(tmp) === null`, then with `portrait.jpg` → `/portrait.jpg`.
- [ ] **Step 3: Run** → FAIL. **Step 4: Implement `lib/assets.ts`, `lib/chromatogram.ts`.** **Step 5: Run** → PASS.
- [ ] **Step 6: Implement the three components**, delete `Hatch.tsx` and `.hatch` CSS, and update the remaining importers (`UnifiedGrid`, `WorkTable`, `LabGrid`, `FeaturedGrid`) to use `Shot` temporarily so the build stays green (they are deleted in Tasks 12 and 14).
- [ ] **Step 7: Verify** — typecheck/build/test.
- [ ] **Step 8: Commit** — `feat(cards): asset resolution, spectrum plates, batch card`.

---

### Task 12: Batches (pinned horizontal scroll)

**Files:**
- Create: `components/Batches.tsx`
- Delete: `components/FeaturedGrid.tsx`
- Modify: `app/page.tsx` (server: resolves images, passes `cards`)

**Interfaces:**
- `Batches({ cards: (CardData & { image: string | null })[] })` — desktop (`md+`, fine pointer, no reduced motion): outer `section` `h-[300vh]`, inner `sticky top-0 h-screen overflow-hidden`; `useScroll({ target: outer, offset: ["start start", "end end"] })`; track `x = useTransform(progress, [0, 1], [0, -(trackWidth - viewportWidth + padding)])` measured with `ResizeObserver`; progress label `BATCH 0${i+1} / 0${n}` where `i = Math.round(progress * (n - 1))` via `useMotionValueEvent`; thin hazmat progress rule `scaleX = progress`. Otherwise: vertical list with `gap-4`. Cards are `BatchCard` at `3/4`, width `clamp(300px, 34vw, 460px)` on desktop. Keyboard: cards are anchors in DOM order, so Tab walks them; nothing is `tabindex=-1`.
- `app/page.tsx`: becomes an async server component that builds `cards = FEATURED.map(p => ({ ...toCard(p), image: projectImage(p.slug) }))` and renders `<Hero/> <Readouts/> <AskBar/> <CautionBand/> <section with SectionStamp 03 BATCHES + heading "Batches" + "all batches →" link> <Batches cards/> <RvPanel …/>` (RvPanel from Task 13; keep `LabPanel` until then).

- [ ] **Step 1: Implement**; delete `FeaturedGrid.tsx`.
- [ ] **Step 2: Verify** — typecheck/build/test; screenshot 1440 at `--window-size=1440,900` after scrolling is not scriptable with the shell alone, so verify the sticky geometry by rendering at `--window-size=1440,3200` (section should show the first card pinned at top of its 300vh block) and at 390 (vertical list, Review Focus 2).
- [ ] **Step 3: Commit** — `feat(batches): pinned horizontal batch scroll`.

---

### Task 13: RV panel and Footer

**Files:**
- Create: `components/RvPanel.tsx`
- Delete: `components/LabPanel.tsx`
- Rewrite: `components/Footer.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx` (pass `stamp`)

**Interfaces:**
- `RvPanel({ entries: { name: string; slug: string; status: string }[] })` — the scroll-scale panel (`scale 0.9→1`, `borderRadius 48→24`) in `bg-sand text-tar`; left: `SectionStamp index="04" label="EXPERIMENTS"` (tar variant), `RV_COPY.title` in `text-panel` display 800, `RV_COPY.sub`; right: list of `entries` as `ElementTile size="md" tone="outline"` (tar border) + name + status `.lab-label`; CTA `Magnetic` `Link href="/work#experiments"` `bg-tar text-bone` → hover `bg-hazmat text-tar` labelled `RV_COPY.cta`. (Builder's call: tar button, hazmat on hover, since the panel is already loud.)
- `Footer({ stamp }: { stamp: string | null })` — send-off `FOOTER.sendoff` in `text-sendoff` display 800 with `clipUp` reveal; hovering the heading reveals `FOOTER.aside` in `.lab-label` beside it; links row (`LINKS`); bottom row: `© year`, `SITE.stamp · 2026`, optional 24px `<img src={stamp}>` with `image-rendering: pixelated`, `SITE.footerNote`. Skips the send-off on `/contact` as today.

- [ ] **Step 1: Implement**, delete `LabPanel.tsx`, wire `RvPanel entries={LAB.map(...)}` at the bottom of `app/page.tsx`, pass `stamp={pixelStamp()}` from `layout.tsx`.
- [ ] **Step 2: Verify** — tests (banned-word test now green with LabPanel gone), typecheck, screenshot bottom of home at 1440.
- [ ] **Step 3: Commit** — `feat(home): RV experiments panel and say-my-name footer`.

---

### Task 14: Inventory (work page)

**Files:**
- Create: `components/Inventory.tsx`
- Delete: `components/UnifiedGrid.tsx`, `components/WorkTable.tsx`, `components/LabGrid.tsx`
- Modify: `app/work/page.tsx`
- Test: `tests/inventory.test.ts`

**Interfaces:**
- `lib/inventory.ts` (new, pure): `INVENTORY_FILTERS = ["All", "Agents", "RAG", "Evals", "Systems", "Experiments"]`, `type InventoryFilter`, `buildInventory(projects, lab): CardData[]` (projects then lab, lab cards get `filters: ["Experiments"]`, projects `filters: tags`), `filterInventory(cards, filter)`, `filterFromHash(hash: string): InventoryFilter` (`"#experiments"` → `"Experiments"`, else `"All"`).
- `Inventory({ cards })` — heading `Inventory` in `text-page` with the count as an `ElementTile size="md" tone="hazmat"` (symbol = zero-padded count, number blank); filters as `md` tiles (`tone="hazmat"` when active, `"outline"` otherwise, each with its label beside); grid `sm:grid-cols-2 md:grid-cols-3` of `BatchCard ratio="16/10" kind` with `layout` + `AnimatePresence popLayout`; cursor-following preview (`useSpring` logic from `WorkTable`) showing the card's `Shot` at 260px, `hidden md:block`; on mount read `window.location.hash` → `filterFromHash`, set filter, and `scrollIntoView({ block: "start" })` the element `#experiments` (an anchor div placed before the grid) after one frame (Review Focus 3).
- `app/work/page.tsx` — server: `cards = buildInventory(PROJECTS, LAB).map(c => ({ ...c, image: c.kind === "experiment" ? labImage(c.slug) : projectImage(c.slug) }))`, renders `SectionStamp 03 INVENTORY` + `<Inventory cards/>`.

- [ ] **Step 1: Write `tests/inventory.test.ts`** — `buildInventory` length `PROJECTS.length + LAB.length`; `filterInventory(cards, "Experiments")` returns only lab cards; `filterInventory(cards, "RAG")` returns projects whose tags include RAG; `filterFromHash("#experiments") === "Experiments"`, `filterFromHash("") === "All"`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement `lib/inventory.ts`.** **Step 4: Run** → PASS.
- [ ] **Step 5: Implement `Inventory.tsx`**, rewrite `work/page.tsx`, delete the three old components.
- [ ] **Step 6: Verify** — typecheck/build; screenshots `/work` at 1440 and 390; `/work#experiments` screenshot shows Experiments tile active.
- [ ] **Step 7: Commit** — `feat(work): inventory grid with tile filters and hash preselect`.

---

### Task 15: Pixel portrait and favicon

**Files:**
- Create: `lib/pixelate.ts`, `components/PixelPortrait.tsx`, `scripts/make-icon.mjs`, `app/icon.svg`
- Delete: `components/Portrait.tsx`
- Modify: `package.json` (`"prebuild": "node scripts/make-icon.mjs"`)
- Test: `tests/pixelate.test.ts`

**Interfaces:**
- `lib/pixelate.ts`: `PALETTE: { name: string; rgb: [number, number, number] }[]` for tar, lab, element, crystal, hazmat, sand, smoke, bone (hex from Global Constraints); `nearest(rgb: [n,n,n]): [n,n,n]` (Euclidean in RGB); `quantizeBlocks(data: Uint8ClampedArray, w: number, h: number, block: number): { cols: number; rows: number; colors: [n,n,n][] }` (average each block then `nearest`); `PIXEL_START = 48`, `PIXEL_END = 6`.
- `PixelPortrait({ src }: { src: string | null })` — if `src` is null: a 4:5 frame holding an `ElementTile size="xl" element={LOGO_TILE} flip` centred on `bg-lab`. Else: hidden `<img>` loads `src`, draws to an offscreen canvas at the display size, and a visible `<canvas>` repaints `quantizeBlocks` output; a Framer `useMotionValue(PIXEL_START)` animated to `PIXEL_END` over 1 s `EASE_OUT` on `whileInView` drives repaints when `Math.round(block)` changes (reduced motion: start at `PIXEL_END`); a `next/image` of the real photo sits on top with `opacity` 0 → 1 on hover/focus, and `click` toggles a `pinned` state that holds it at 1. Hazmat bracket frame: four 28px L-shaped `motion.span` corners drawing in (`scale 0→1`, origin at the corner).
- `scripts/make-icon.mjs` — reads `public/portrait.jpg|png` if present; with `sharp`: resize to 32×32 (`kernel: "nearest"`), `raw()`, quantise each pixel to `PALETTE` (duplicate the palette in the script; it cannot import TS), write `public/pixel-portrait.png` (64×64 nearest upscale) and `app/icon.png` (256×256). If no portrait: print `no portrait, keeping icon.svg` and exit 0 without writing.
- `app/icon.svg` — a 64×64 `Pa` tile: element-green square, bone 3px border, `Pa` centred in a sans at 28px, `91` top-left at 9px.

- [ ] **Step 1: Write `tests/pixelate.test.ts`** — `nearest([0,0,0])` is tar; `nearest([250,200,50])` is hazmat; `quantizeBlocks` on a 4×4 all-hazmat buffer with block 2 returns `cols 2 rows 2` and four hazmat colours.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement `lib/pixelate.ts`.** **Step 4: Run** → PASS.
- [ ] **Step 5: Implement `PixelPortrait.tsx`, `scripts/make-icon.mjs`, `app/icon.svg`**; delete `Portrait.tsx`; add `prebuild`.
- [ ] **Step 6: Verify (Review Focus 4)** — `node scripts/make-icon.mjs` with no portrait → prints the skip line, exit 0, no files written. Then create a throwaway `public/portrait.jpg` with `sharp` from a solid gradient (`node -e` one-liner), run the script → `public/pixel-portrait.png` and `app/icon.png` exist; delete all three generated files afterwards (`git status` clean apart from source). Typecheck/build.
- [ ] **Step 7: Commit** — `feat(about): pixel-art portrait in the lab palette, favicon script`.

---

### Task 16: About page

**Files:**
- Create: `components/StackTable.tsx`, `components/Notebook.tsx`
- Rewrite: `components/AboutPrinciples.tsx` → `components/Principles.tsx` (rename)
- Rewrite: `app/about/page.tsx`

**Interfaces:**
- `StackTable()` — `STACK` as `md` tiles in a periodic-table fragment: 2 rows, `grid-cols-6`, row two offset by one column (`col-start-2`); hover lifts `y: -4` and swaps the tile's bottom name for the full label.
- `Principles()` — the pinned-stacked cards (same sticky logic), colours from `PRINCIPLES.bg/fg`, each card opens with its `index` as `.lab-label` and its title in `text-[28px] md:text-[44px]` display 800.
- `Notebook()` — `TIMELINE` on a `.notebook-rules` background; each row: `when` in `.lab-label` text-hazmat as a left stamp, `where` display 600, `what` smoke; rows reveal `clipUp` staggered.
- `app/about/page.tsx` — server: `portrait = portraitImage()`; layout `md:grid-cols-[420px_1fr]`: `PixelPortrait src={portrait}` left; right: `SectionStamp 01 THE CHEMIST`, headline `Part chemist, part engineer, full-time tinkerer.` (hazmat on `chemist`), bio paragraph unchanged, `StackTable`; then `Principles`; then `Notebook` under heading `.lab-label` `LAB NOTEBOOK`.

- [ ] **Step 1: Implement**, delete `AboutPrinciples.tsx`.
- [ ] **Step 2: Verify** — typecheck/build; screenshots `/about` 1440 and 390.
- [ ] **Step 3: Commit** — `feat(about): the chemist, stack table, principles, lab notebook`.

---

### Task 17: Contact page

**Files:**
- Modify: `components/ContactForm.tsx` (styling + copy)
- Rewrite: `app/contact/page.tsx`

**Interfaces:**
- `ContactForm` keeps state and `mailto`. Fields become notebook lines (`border-b border-line bg-transparent py-3`, focus → `border-hazmat`), labels `.lab-label`, interest chips as `md` tiles (`hazmat` when picked, `outline` otherwise) with label text beside; submit `Magnetic` hazmat `send it`; success: `Received.` display 800 + `You’re right — Parth.` + the mailto button + `write another`.
- `app/contact/page.tsx` — `SectionStamp 05 SAY MY NAME`, headline `Say` / `my name.` in `text-contact`, hazmat `name.`, subline unchanged, `LINKS` list, `Smoke intensity={0.6}` behind, form on the right.

- [ ] **Step 1: Implement.**
- [ ] **Step 2: Verify** — typecheck/build; screenshots `/contact` 1440 and 390.
- [ ] **Step 3: Commit** — `feat(contact): say my name`.

---

### Task 18: Page transitions

**Files:**
- Create: `components/TransitionProvider.tsx`, `components/TransitionLink.tsx`, `app/template.tsx`
- Modify: `components/Nav.tsx`, `components/RvPanel.tsx`, `components/Footer.tsx`, `app/page.tsx` (internal links use `TransitionLink`), `app/layout.tsx`

**Interfaces:**
- `TransitionProvider` — context `{ navigate(href: string): Promise<void> }` and renders two fixed full-screen `motion.div` layers (`bg-hazmat` z-70, `bg-lab` z-71) with `scaleY` origin bottom. `navigate`: if reduced motion → `router.push` immediately; else animate hazmat `0→1` (260 ms) then lab `0→1` (220 ms, overlapping by 120 ms), `router.push(href)`, and resolve. `template.tsx` on mount calls `reveal()` from the same context: layers animate `scaleY 1→0` with origin top (hazmat 260 ms after lab 220 ms), total ≤ 600 ms, then both reset to 0. First load: layers start at 0, `reveal()` is a no-op when nothing is covering.
- `TransitionLink` — `next/link` wrapper intercepting unmodified left-clicks on same-origin hrefs: `e.preventDefault(); navigate(href)`. External or `target=_blank` links use plain `Link`.
- `app/template.tsx` — `"use client"`, wraps `children` in `motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}` and calls `reveal()` in an effect.

- [ ] **Step 1: Implement** and swap internal links in Nav, RvPanel CTA, Footer, home "all batches →".
- [ ] **Step 2: Verify** — typecheck/build; manual reasoning that back/forward (no `navigate`) still renders because `reveal()` is a no-op and the template fade still runs.
- [ ] **Step 3: Commit** — `feat(motion): hazmat/lab wipe page transitions`.

---

### Task 19: Final pass — a11y, performance, docs

**Files:**
- Modify: `README.md`, any component flagged below

- [ ] **Step 1: Reduced-motion audit** — `grep -rn "prefers-reduced-motion\|useReducedMotion" components lib app` and confirm every canvas (`Smoke`, `PixelPortrait`), the preloader, `Batches`, `CautionBand`, `TileField`, `Cursor`, `SmoothScroll`, `Headline` auto-reroll each have a branch. Fix any missing.
- [ ] **Step 2: Vocabulary** — `npm test` (source grep) and `grep -rniE "\b(cook|meth)" .next/server/app | head` after `npm run build` → no matches.
- [ ] **Step 3: Lighthouse** — `CHROME_PATH=~/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell npx --yes lighthouse http://localhost:3000 --preset=desktop --quiet --chrome-flags="--headless" --output=json --output-path=<scratchpad>/lh.json` against `npm run start` (production build). Expected: performance ≥ 90, accessibility ≥ 95. Repeat with the mobile default preset → performance ≥ 75. If the headless shell refuses to launch under Lighthouse, record that and fall back to `next build` bundle sizes (first-load JS of `/` ≤ 180 kB) plus a manual checklist.
- [ ] **Step 4: Screenshots** of all four routes at 1440 and 390 into the scratchpad; eyeball for overflow, unreadable contrast (bone on sand, tar on hazmat), broken tiles.
- [ ] **Step 5: README** — replace the "Neural Arcade" sections with: the concept, the folder convention for images (`public/work/<slug>.png`, `public/lab/<slug>.png`, `public/portrait.jpg`), the icon script, the vocabulary rule, and the test command. Keep the ask-bar, grounding, rate-limit and theme sections (update token names).
- [ ] **Step 6: Final verification** — `npm test && npm run typecheck && npm run lint && npm run build` all clean; `git status` clean.
- [ ] **Step 7: Commit** — `docs: the lab README; a11y and perf pass`.
