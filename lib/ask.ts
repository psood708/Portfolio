/**
 * The fallback corpus for the "Ask my portfolio anything…" bar.
 *
 * `app/api/ask/route.ts` answers with Claude now; this is what answers when it
 * cannot — no `ANTHROPIC_API_KEY`, a tripped rate limit, an upstream error, or a
 * refusal. Keyword-matched and deliberately narrow, but it means the bar always
 * says something true rather than showing an error, and it keeps working with
 * the dev server offline.
 *
 * When these answer, the panel labels itself "canned response". Keep them in
 * step with `lib/content.ts` so the two corpora never contradict each other.
 */

type Canned = { match: RegExp; answer: string };

const CANNED: Canned[] = [
  {
    match: /\b(rag|retriev|vector|embed|pgvector|hnsw|index|chunk|search)\w*/i,
    answer:
      "Two angles. MemoryWeave does retrieval as a three-tier memory — episodic vector recall plus live knowledge-graph traversal plus working context, merged under a token budget, which came out ~38% cheaper than dumping the full buffer. HNSW Vector DB goes a layer lower: the whole index written from scratch in Rust, no external ANN library, 98% recall at 1M vectors.",
  },
  {
    match: /\b(rust|performance|low.?level|systems|memory|mmap|concurren|spark|pyspark|distributed|scale|telemetry|isro)\w*/i,
    answer:
      "HNSW Vector DB is the Rust one — hand-rolled Hierarchical Navigable Small World index, memory-mapped persistence, parallel search via Rayon, REST API over Axum. The point was to stop treating HNSW as a black box and actually control graph connectivity, beam width and the recall-versus-latency trade.",
  },
  {
    match: /\b(eval|benchmark|test|judge|regress|measur|accurac)\w*/i,
    answer:
      "Evals get built alongside, not after. Ollive ships a 45-prompt battery with LLM-as-judge scoring to compare an open-weights assistant against a frontier one. Clinical Intelligence Agent runs Ragas plus custom clinical accuracy evals. Terra Intelligence Engine has 50 unit and integration tests that run in under two seconds.",
  },
  {
    match: /\b(agent|multi.?agent|tool.?use|function.?call|orchestrat|langgraph|mcp)\w*/i,
    answer:
      "Clinical Intelligence Agent is a four-agent pipeline — extract, retrieve, verify, synthesise — over unstructured clinical text, on LangGraph with MCP, running entirely on local and free-tier inference at zero ongoing cost. MemoryWeave uses LangGraph for orchestration too. AgentReadiness comes at agents from the other side: scoring whether a site is even legible to one.",
  },
  {
    match: /\b(health|clinical|medical|patient|wearable|sensor|ehr|bio|pharma)\w*/i,
    answer:
      "Healthcare is the day job. At Aspect Ratio I build ML pipelines for patient cohort extraction from high-dimensional clinical data, and bio-NLP on top — BioBERT over EHR notes, PubMedBERT over publications, UMAP plus BERTopic to surface prescribing patterns and physician referral networks. The side projects run parallel: Terra Intelligence Engine over wearable and CGM data, and Clinical Intelligence Agent for the ~80% of clinical data that lives in unstructured notes.",
  },
  {
    match: /\b(cost|cheap|free|budget|local|ollama|self.?host)\w*/i,
    answer:
      "Clinical Intelligence Agent runs at $0/month — local Ollama with a Groq free-tier fallback for the latency-sensitive synthesis step. Ollive is the same instinct: open-weights Qwen2.5 on Hugging Face Spaces against Gemini Flash, both on free tiers, measured honestly against each other.",
  },
  {
    match: /\b(latenc|speed|fast|p50|p95|ms|throughput)\w*/i,
    answer:
      "Where it is measured: MemoryWeave builds context in ~3.5s on Hugging Face inference, ~800ms on Groq. Ollive's frontier path answers in ~0.8–1.5s against ~3–5s for the open-weights one. Clinical Intelligence Agent synthesises a 500-word summary in ~1.1s on Groq versus ~8s fully local.",
  },
  {
    match: /\b(stack|tech|tool|language|framework|python|typescript|next)\w*/i,
    answer:
      "Python and TypeScript day to day, Rust when the data structure is the point. LangGraph, FastAPI, Next.js, PostgreSQL with pgvector, MCP, Langfuse for tracing, Docker and Vercel for shipping. Boring infrastructure on purpose so the interesting part stays in the model layer.",
  },
  {
    match: /\b(hire|hiring|available|role|job|work with|freelance|contract|open to)\w*/i,
    answer:
      "Yes — open to applied AI roles and freelance builds, replies within 48h. The contact page has the form, or email works.",
  },
  {
    match: /\b(contact|email|reach|dm|message|linkedin|github|repo)\w*/i,
    answer:
      "github.com/psood708 has everything, and linkedin.com/in/parth-sood is the other route. The contact page has a form that reaches the same inbox.",
  },
  {
    match: /\b(lab|experiment|side.?project|weekend|smaller|fun)\w*/i,
    answer:
      "The lab holds the smaller builds: a facility compliance checker that tells you which regulatory frameworks a design meets, an expense tracker I actually use, a cointegration-based pairs trading study, and an AWS application from the MoMacMo internship.",
  },
  {
    match: /\b(who|about|background|yourself|experience|career|year|study|degree)\w*/i,
    answer:
      "Data Science Analyst at Aspect Ratio since 2025 — patient cohort pipelines, BioBERT over clinical notes, physician referral networks. Before that: ML research intern at ISRO's Space Applications Centre moving 10TB+ of telemetry through PySpark, and a software engineering internship at MoMacMo doing seismic ML on AWS. B.Tech in Computer Engineering from PDEU, CGPA 9.41. The About page has the longer version.",
  },
];

const FALLBACK =
  "Not in my context window yet. Try asking about retrieval, Rust, evals, agents, cost, latency or the stack — or head to github.com/psood708 and read the source.";

export const SUGGESTIONS = [
  "What have you shipped?",
  "How do you think about evals?",
  "Why write a vector DB in Rust?",
] as const;

export function answerFor(question: string): string {
  const q = question.trim();
  if (!q) return FALLBACK;
  return CANNED.find((c) => c.match.test(q))?.answer ?? FALLBACK;
}

/** Split into chunks that read like tokens rather than whole words. */
export function tokenize(text: string): string[] {
  return text.match(/\s*\S{1,6}|\s+/g) ?? [text];
}
