/**
 * Every string and number here comes straight out of the `renderVals()` block in
 * `Parth Portfolio.dc.html`; the projects, lab entries and career history are
 * Parth's own, from github.com/psood708 and his resume.
 */

export const SITE = {
  name: "Parth Sood",
  role: "applied_ai_engineer",
  title: "Applied AI engineer",
  roleLine: "APPLIED AI ENGINEER · ASPECT RATIO · PUNE",
  stamp: "99.1% PURE · NO HALF MEASURES",
  email: "parthsood45@gmail.com",
  handle: "@psood708",
  footerNote: "made with Next.js, not by an LLM (mostly)",
} as const;

/** `~/parth{ext}` — the nav logo cycles these on click. */
export const EXTENSIONS = [".sood", ".dev", ".ai", ".exe", ".tsx", ".py"] as const;

/**
 * The hazmat word in the sub-headline: `Pure, applied AI. [word] of the time.`
 * Click rerolls. Deliberately short so the line never re-wraps.
 */
export const HEADLINE_WORDS = ["99.1%", "Most", "All", "Some", "Enough"] as const;

/** Bio register. Indexed by the purity dial — see `bioForPurity`. */
export const BIO_REGISTERS: { max: number; text: string }[] = [
  {
    max: 0.4,
    text: "Parth Sood. Data Science Analyst at Aspect Ratio. Builds ML pipelines, clinical NLP systems and retrieval infrastructure.",
  },
  {
    max: 1.2,
    text: "Hi, I’m Parth — I build applied AI for healthcare: cohort pipelines, BioBERT over clinical notes, and a vector index I wrote from scratch in Rust.",
  },
  {
    max: 1.7,
    text: "Hey!! Parth here — I wrangle clinical NLP into something useful, argue with vector indexes I built myself, and occasionally win. Wanna build?",
  },
  {
    max: Infinity,
    text: "parth.exe → BioBERT?? yes. 10TB of telemetry!! survived. vibes: immaculate. tokens: spicy. is this a bio or a poem? ship it 🚀",
  },
];

/** The dial tops out at the famous number. */
export const PURITY_MAX = 99.1;
export const PURITY_DEFAULT = 99.1;

/**
 * Dropping purity degrades the bio. Lab grade is sharp and playful; a clean
 * batch is friendly; a cut one is formal; a contaminated one is the poem.
 */
export function bioForPurity(purity: number): string {
  if (purity >= 99) return BIO_REGISTERS[2].text;
  if (purity >= 85) return BIO_REGISTERS[1].text;
  if (purity >= 50) return BIO_REGISTERS[0].text;
  return BIO_REGISTERS[3].text;
}

export function purityLabel(purity: number): string {
  if (purity >= 99) return "lab grade";
  if (purity >= 85) return "clean";
  if (purity >= 50) return "cut";
  return "contaminated";
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
  "Clinical NLP",
  "Vector search",
  "PySpark",
  "Rust",
  "Python",
  "TypeScript",
] as const;

export type Tag = "Agents" | "RAG" | "Evals" | "Systems";
export const FILTERS = ["All", "Agents", "RAG", "Evals", "Systems"] as const;
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
  /** Optional real screenshot. Path relative to /public, e.g. "/work/memoryweave.png" */
  img?: string;
  href: string;
  tags: Tag[];
};

export const PROJECTS: Project[] = [
  {
    num: "01",
    slug: "memoryweave",
    name: "MemoryWeave",
    line: "Conversational AI with three-tier memory: episodic recall, knowledge graph, working context",
    stack: "FastAPI · LangGraph · PostgreSQL · Next.js",
    metric: "−38%",
    metricLabel: "context tokens",
    year: "2026",
    shot: "architecture diagram",
    href: "https://github.com/psood708/memory-weave",
    tags: ["Agents", "RAG", "Evals"],
  },
  {
    num: "02",
    slug: "hnsw-vector-db",
    name: "HNSW Vector DB",
    line: "Vector database written from scratch in Rust — hand-rolled HNSW index, mmap persistence, parallel search",
    stack: "Rust · Axum · Rayon · mmap",
    metric: "98%",
    metricLabel: "recall @ 1M vectors",
    year: "2026",
    shot: "recall / latency plot",
    href: "https://github.com/psood708/HNSW_Vector_DB",
    tags: ["RAG", "Systems"],
  },
  {
    num: "03",
    slug: "terra-intelligence-engine",
    name: "Terra Intelligence Engine",
    line: "Health intelligence layer over unified wearable, CGM and sleep sensor infrastructure",
    stack: "Python 3.12 · FastAPI · Pydantic v2 · Next.js",
    metric: "50/50",
    metricLabel: "tests, under 2s",
    year: "2026",
    shot: "insights dashboard",
    href: "https://terra-ai-one.vercel.app",
    tags: ["Systems", "Evals"],
  },
  {
    num: "04",
    slug: "clinical-intelligence-agent",
    name: "Clinical Intelligence Agent",
    line: "Four-agent pipeline that extracts, retrieves, verifies and synthesises structured insight from clinical notes",
    stack: "Python · LangGraph · MCP · Ollama / Groq",
    metric: "$0",
    metricLabel: "inference cost",
    year: "2026",
    shot: "agent pipeline",
    href: "https://github.com/psood708/Clinical-Intelligence-Agent",
    tags: ["Agents", "RAG", "Evals"],
  },
  {
    num: "05",
    slug: "agentreadiness",
    name: "AgentReadiness",
    line: "Scores any site for how well AI agents can read it, and drafts its /llms.txt",
    stack: "TypeScript · Next.js · Vercel",
    metric: "8",
    metricLabel: "automated checks",
    year: "2026",
    shot: "score report",
    href: "https://agent-sites-five.vercel.app",
    tags: ["Agents", "Systems"],
  },
  {
    num: "06",
    slug: "ollive",
    name: "Ollive",
    line: "Two assistants with identical capabilities — open-weights vs frontier — run head to head",
    stack: "Qwen2.5 · Gemini Flash · Langfuse · Tavily",
    metric: "45",
    metricLabel: "prompt eval battery",
    year: "2026",
    shot: "eval comparison",
    href: "https://github.com/psood708/ollive_assignment",
    tags: ["Agents", "Evals"],
  },
];

/** The four that get cards on the home page. */
export const FEATURED = PROJECTS.slice(0, 4);

export type LabEntry = {
  slug: string;
  name: string;
  line: string;
  status: "shipped" | "reacting" | "broke it";
  date: string;
  shot: string;
  /** Optional real screenshot. Path relative to /public, e.g. "/lab/finfun.png" */
  img?: string;
  rot: number;
  href: string;
};

export const LAB: LabEntry[] = [
  {
    slug: "facility-compliance",
    name: "Facility Compliance",
    line: "Enter a facility's design spec, get back which regulatory frameworks it meets and what to change.",
    status: "shipped",
    date: "Sep 2026",
    shot: "compliance result",
    rot: -2,
    href: "https://facility-planning.vercel.app",
  },
  {
    slug: "finfun",
    name: "FinFun",
    line: "Personal expense tracker. The one I actually use to find out where the money went.",
    status: "shipped",
    date: "Oct 2024",
    shot: "spend breakdown",
    rot: 1.5,
    href: "https://github.com/psood708/FinFun",
  },
  {
    slug: "pairs-trading",
    name: "Pairs Trading",
    line: "Cointegration-based statistical arbitrage, worked through in notebooks.",
    status: "reacting",
    date: "Oct 2023",
    shot: "spread chart",
    rot: -1,
    href: "https://github.com/psood708/Pairs_Trading_Project",
  },
  {
    slug: "momacmo",
    name: "MoMacMo",
    line: "AWS application built and deployed during the MoMacMo internship.",
    status: "shipped",
    date: "Dec 2023",
    shot: "pipeline run",
    rot: 2,
    href: "https://github.com/psood708/MoMacMo",
  },
];

export const STACK = [
  "Python",
  "TypeScript",
  "Rust",
  "PySpark",
  "PyTorch",
  "BioBERT",
  "LangGraph",
  "FastAPI",
  "Next.js",
  "PostgreSQL",
  "AWS",
  "Docker",
] as const;

export const PRINCIPLES = [
  {
    index: "01 / prototype",
    title: "Respect the chemistry",
    body: "A working ugly thing beats a pretty slide.",
    bg: "var(--color-element)",
    fg: "var(--color-bone)",
  },
  {
    index: "02 / measure",
    title: "Know your purity",
    body: "If you can’t score it, you can’t ship it.",
    bg: "var(--color-hazmat)",
    fg: "var(--color-tar)",
  },
  {
    index: "03 / harden",
    title: "No half measures",
    body: "Guardrails, fallbacks, dashboards, sleep.",
    bg: "var(--color-sand)",
    fg: "var(--color-tar)",
  },
] as const;

export const TIMELINE = [
  {
    when: "2025 — now",
    where: "Aspect Ratio",
    what: "Data Science Analyst · patient cohort pipelines, clinical NLP, physician referral networks",
  },
  {
    when: "2024",
    where: "ISRO · Space Applications Centre",
    what: "ML Research Intern · 10TB+ telemetry on PySpark, Kalman-filter anomaly detection",
  },
  {
    when: "2023 — 24",
    where: "MoMacMo",
    what: "Software Engineer Intern · seismic ML and RESTful APIs on AWS",
  },
  {
    when: "2021 — 25",
    where: "PDEU",
    what: "B.Tech, Computer Engineering · CGPA 9.41/10",
  },
] as const;

export const LINKS = [
  { name: "Email", handle: SITE.email, href: `mailto:${SITE.email}` },
  { name: "GitHub", handle: "@psood708", href: "https://github.com/psood708" },
  { name: "LinkedIn", handle: "/in/parth-sood", href: "https://www.linkedin.com/in/parth-sood/" },
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
  { label: "About", href: "/about" },
] as const;

export const CONTACT_LABEL = "Say my name";

/** The sand panel on the home page. */
export const RV_COPY = {
  title: "Not everything is a batch.",
  sub: "Some of it was built in the RV.",
  cta: "open the RV ↗",
} as const;

export const FOOTER = {
  sendoff: "Say my name.",
  aside: "(it’s Parth)",
} as const;

/** `+ precursor` button copy, keyed off the yield percentage. */
export function trainMessage(pct: number): string {
  if (pct >= 100) return "yield: 100% (jk)";
  if (pct === 0) return "batch: empty";
  return `reacting… ${pct}%`;
}

/** Message-box footer. ~4 chars per token, same as the design. */
export function tokenMessage(msg: string): string {
  const n = Math.ceil(msg.length / 4);
  if (n === 0) return "0 tokens · take your time";
  if (n < 40) return `~${n} tokens · keep going`;
  return `~${n} tokens · now we’re talking`;
}
