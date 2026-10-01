/**
 * The "Ask my portfolio anything…" bar. Deliberately not a model call — these
 * are canned answers matched on keywords, streamed client-side so the bar feels
 * alive without a key, a server route or a bill. Swap `answerFor` for a fetch to
 * a real route later and the UI does not change.
 */

type Canned = { match: RegExp; answer: string };

const CANNED: Canned[] = [
  {
    match: /\b(rag|retriev|vector|embed|pgvector|chunk)\w*/i,
    answer:
      "DocPilot is the big one — a RAG copilot over 40k internal docs, built on Python, pgvector and LangGraph. It cut support tickets 62%. The hard part was never the retrieval, it was the chunking strategy and knowing when to say “I don’t know”.",
  },
  {
    match: /\b(eval|benchmark|test|judge|regress)\w*/i,
    answer:
      "Evals are the thing I get evangelical about. Evalbench is a regression suite for LLM features — TypeScript, LLM-as-judge, wired into CI — and it made releases 3× faster because nobody had to hand-check prompts any more. Principle 02: write the evals first.",
  },
  {
    match: /\b(agent|tool.?use|function.?call|orchestrat)\w*/i,
    answer:
      "Three agent projects: Murmur, a realtime voice agent for bookings at 480ms p50; Tidy, which triages a messy inbox over the Gmail API; and DocPilot’s retrieval loop. The lesson from all three is that tool schemas are product design, not plumbing.",
  },
  {
    match: /\b(latenc|speed|fast|p50|p99|ms)\w*/i,
    answer:
      "Murmur runs at 480ms p50 end-to-end — speech in, speech out. Getting there meant streaming every stage, speculative TTS on the first clause, and accepting a slightly worse model for a much better conversation.",
  },
  {
    match: /\b(stack|tech|tool|language|framework|python|typescript)\w*/i,
    answer:
      "Python and TypeScript day to day. PyTorch, LangGraph, pgvector, FastAPI, Next.js, Modal, Weights & Biases, Docker. I pick boring infrastructure on purpose so the interesting part stays in the model layer.",
  },
  {
    match: /\b(hire|hiring|available|role|job|work with|freelance|contract)\w*/i,
    answer:
      "Yes — open to applied AI roles and freelance builds. Reply time is under 48h, which is faster than most agents. The contact page has the form, or just email parth@yourdomain.dev.",
  },
  {
    match: /\b(contact|email|reach|dm|message|linkedin|github)\w*/i,
    answer:
      "parth@yourdomain.dev is the fastest route. Also @parthsood on GitHub and Hugging Face, /in/parthsood on LinkedIn.",
  },
  {
    match: /\b(lab|experiment|side.?project|weekend|fun)\w*/i,
    answer:
      "The lab is where the half-baked things live: a linter that rejects PRs whose commit messages aren’t haikus, two agents negotiating over a used couch, a game about writing the shortest working prompt. Some shipped. Fridge Vision exploded.",
  },
  {
    match: /\b(who|about|background|yourself|experience|career|year)\w*/i,
    answer:
      "Applied AI Engineer, currently shipping agents and evals. Before that: ML engineering on search and retrieval, and a stretch on a data platform. B.Tech in Computer Science. I sit between research and product — taking what models can do this month and turning it into something people rely on.",
  },
  {
    match: /\b(vision|image|multimodal|photo|ocr)\w*/i,
    answer:
      "Shelfsight — a vision model for retail shelf audits, PyTorch to ONNX to edge devices, 94% accuracy. Fridge Vision was the unserious version: photo of your fridge, three dinner ideas. It mostly suggested toast.",
  },
];

const FALLBACK =
  "Not in my context window yet. Try asking about RAG, evals, agents, latency, the stack, or whether I’m hiring-adjacent — or just email parth@yourdomain.dev and ask a human.";

export const SUGGESTIONS = [
  "What have you shipped?",
  "How do you think about evals?",
  "Are you available for work?",
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
