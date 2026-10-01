/**
 * Every string and number here comes straight out of the `renderVals()` block in
 * `Parth Portfolio.dc.html`. Swap the placeholders (Company One, yourdomain.dev)
 * for real values and the whole site follows.
 */

export const SITE = {
  name: "Parth Sood",
  role: "applied_ai_engineer",
  email: "parth@yourdomain.dev",
  handle: "@parthsood",
  footerNote: "made with Next.js, not by an LLM (mostly)",
} as const;

/** `~/parth{ext}` — the nav logo cycles these on click. */
export const EXTENSIONS = [".sood", ".dev", ".ai", ".exe", ".tsx", ".py"] as const;

/** The green word in the headline. Click rerolls. */
export const HEADLINE_WORDS = [
  "real work",
  "your chores",
  "the math",
  "nice things",
  "less dumb stuff",
] as const;

/** Bio register, selected by the temperature slider. */
export const BIO_REGISTERS: { max: number; text: string }[] = [
  {
    max: 0.4,
    text: "Parth Sood. Applied AI Engineer. Builds agents, retrieval systems and evaluations for production use.",
  },
  {
    max: 1.2,
    text: "Hi, I’m Parth — I ship agents, RAG systems and evals that survive contact with actual users. Less demo, more prod.",
  },
  {
    max: 1.7,
    text: "Hey!! Parth here — I wrangle LLMs into products, argue with vector databases and occasionally win. Wanna build?",
  },
  {
    max: Infinity,
    text: "parth.exe → agents?? yes. evals!! always. vibes: immaculate. tokens: spicy. is this a bio or a poem? ship it 🚀",
  },
];

export function bioFor(temp: number): string {
  return (BIO_REGISTERS.find((r) => temp < r.max) ?? BIO_REGISTERS.at(-1)!).text;
}

/** Fired off by the hallucinations toggle, one per flip. */
export const HALLUCINATIONS = [
  "Parth once fine-tuned a model on his grandma’s recipes. It now refuses to share them.",
  "Fact: every bug Parth fixed came back as a feature request.",
  "Parth’s GPU has a name. It’s Kevin.",
  "Studies show 9/10 recruiters scroll to this toggle.",
] as const;

export const MARQUEE = [
  "Agents",
  "RAG",
  "Evals",
  "Fine-tuning",
  "Tool use",
  "Voice",
  "Vision",
  "Python",
  "TypeScript",
] as const;

export type Tag = "Agents" | "RAG" | "Evals" | "Multimodal";
export const FILTERS = ["All", "Agents", "RAG", "Evals", "Multimodal"] as const;
export type Filter = (typeof FILTERS)[number];

export type Project = {
  num: string;
  slug: string;
  name: string;
  line: string;
  stack: string;
  metric: string;
  metricLabel: string;
  year: string;
  shot: string;
  tags: Tag[];
};

export const PROJECTS: Project[] = [
  {
    num: "01",
    slug: "docpilot",
    name: "DocPilot",
    line: "RAG copilot over 40k internal docs",
    stack: "Python · pgvector · LangGraph",
    metric: "−62%",
    metricLabel: "support tickets",
    year: "2026",
    shot: "chat UI screenshot",
    tags: ["RAG", "Agents"],
  },
  {
    num: "02",
    slug: "evalbench",
    name: "Evalbench",
    line: "Regression evals for LLM features",
    stack: "TS · LLM-as-judge · CI",
    metric: "3×",
    metricLabel: "faster releases",
    year: "2025",
    shot: "eval dashboard",
    tags: ["Evals"],
  },
  {
    num: "03",
    slug: "murmur",
    name: "Murmur",
    line: "Realtime voice agent for bookings",
    stack: "WebRTC · STT/TTS · tools",
    metric: "480ms",
    metricLabel: "p50 latency",
    year: "2025",
    shot: "voice flow demo",
    tags: ["Agents", "Multimodal"],
  },
  {
    num: "04",
    slug: "shelfsight",
    name: "Shelfsight",
    line: "Vision model for retail shelf audits",
    stack: "PyTorch · ONNX · edge",
    metric: "94%",
    metricLabel: "accuracy",
    year: "2024",
    shot: "detection overlay",
    tags: ["Multimodal"],
  },
  {
    num: "05",
    slug: "tidy",
    name: "Tidy",
    line: "Agent that triages a messy inbox",
    stack: "Function calling · Gmail API",
    metric: "2h/wk",
    metricLabel: "saved",
    year: "2024",
    shot: "inbox UI",
    tags: ["Agents"],
  },
  {
    num: "06",
    slug: "finetune-lite",
    name: "Finetune-lite",
    line: "LoRA pipeline for domain models",
    stack: "HF · LoRA · Modal",
    metric: "−70%",
    metricLabel: "cost",
    year: "2023",
    shot: "training curves",
    tags: ["Evals"],
  },
];

/** The four that get cards on the home page. */
export const FEATURED = PROJECTS.slice(0, 4);

export type LabEntry = {
  name: string;
  line: string;
  status: "shipped" | "cooking" | "broke it";
  date: string;
  shot: string;
  rot: number;
};

export const LAB: LabEntry[] = [
  {
    name: "Haiku Linter",
    line: "Rejects PRs whose commit messages aren’t haikus.",
    status: "shipped",
    date: "Aug 2026",
    shot: "gif",
    rot: -2,
  },
  {
    name: "Agent Arena",
    line: "Two agents negotiate the price of a used couch.",
    status: "cooking",
    date: "Jul 2026",
    shot: "video loop",
    rot: 1.5,
  },
  {
    name: "Prompt Golf",
    line: "Shortest prompt that gets the right answer wins.",
    status: "shipped",
    date: "May 2026",
    shot: "game screen",
    rot: -1,
  },
  {
    name: "Fridge Vision",
    line: "Photo of fridge → three dinner ideas.",
    status: "broke it",
    date: "Mar 2026",
    shot: "phone demo",
    rot: 2,
  },
  {
    name: "Tiny Tokens",
    line: "Visualise how a model tokenizes your name.",
    status: "shipped",
    date: "Jan 2026",
    shot: "token viz",
    rot: -1.5,
  },
  {
    name: "Rubber Duck 2",
    line: "A debugging duck that asks annoying questions.",
    status: "cooking",
    date: "Dec 2025",
    shot: "duck photo",
    rot: 1,
  },
];

export const STACK = [
  "Python",
  "TypeScript",
  "PyTorch",
  "LangGraph",
  "pgvector",
  "FastAPI",
  "Next.js",
  "Modal",
  "Weights & Biases",
  "Docker",
] as const;

export const PRINCIPLES = [
  {
    index: "01 / prototype",
    title: "Hack it together in a day",
    body: "A working ugly thing beats a pretty slide.",
    bg: "var(--color-lime)",
  },
  {
    index: "02 / measure",
    title: "Write the evals first",
    body: "If you can’t score it, you can’t ship it.",
    bg: "var(--color-violet)",
  },
  {
    index: "03 / harden",
    title: "Make it boring in prod",
    body: "Guardrails, fallbacks, dashboards, sleep.",
    bg: "var(--color-bone)",
  },
] as const;

export const TIMELINE = [
  { when: "2024 — now", where: "Company One", what: "Applied AI Engineer · agents & evals" },
  { when: "2022 — 24", where: "Company Two", what: "ML Engineer · search & retrieval" },
  { when: "2021 — 22", where: "Company Three", what: "Software Engineer · data platform" },
  { when: "2017 — 21", where: "University", what: "B.Tech, Computer Science" },
] as const;

export const LINKS = [
  { name: "Email", handle: "parth@yourdomain.dev", href: "mailto:parth@yourdomain.dev" },
  { name: "GitHub", handle: "@parthsood", href: "https://github.com/parthsood" },
  { name: "LinkedIn", handle: "/in/parthsood", href: "https://linkedin.com/in/parthsood" },
  { name: "Hugging Face", handle: "@parthsood", href: "https://huggingface.co/parthsood" },
] as const;

export const INTERESTS = [
  "Full-time role",
  "Freelance build",
  "Advice / chat",
  "Speaking",
] as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
] as const;

/** `+ data` button copy, keyed off the training percentage. */
export function trainMessage(pct: number): string {
  if (pct >= 100) return "agi achieved (jk)";
  if (pct === 0) return "model: hungry";
  return `training… ${pct}%`;
}

/** Message-box footer. ~4 chars per token, same as the design. */
export function tokenMessage(msg: string): string {
  const n = Math.ceil(msg.length / 4);
  if (n === 0) return "0 tokens · take your time";
  if (n < 40) return `~${n} tokens · keep going`;
  return `~${n} tokens · now we’re talking`;
}
