/**
 * The periodic table is the site's type system. Real elements where the
 * name allows it (P · Ar · Th · S spell Parth Sood; Pa is the nav logo), and
 * invented ones with a stable three-digit number for everything else, so the
 * stack and the filters can wear the same tile.
 */

export type Element = { symbol: string; number: number; name: string };

const el = (symbol: string, number: number, name: string): Element => ({
  symbol,
  number,
  name,
});

export const ELEMENTS: Record<string, Element> = {
  // the name
  P: el("P", 15, "Phosphorus"),
  Ar: el("Ar", 18, "Argon"),
  Th: el("Th", 90, "Thorium"),
  S: el("S", 16, "Sulfur"),
  Pa: el("Pa", 91, "Protactinium"),
  // the stack
  Py: el("Py", 0, "Python"),
  Rs: el("Rs", 0, "Rust"),
  Ts: el("Ts", 0, "TypeScript"),
  Ps: el("Ps", 0, "PySpark"),
  Pt: el("Pt", 78, "PyTorch"),
  Bb: el("Bb", 0, "BioBERT"),
  Lg: el("Lg", 0, "LangGraph"),
  Fa: el("Fa", 0, "FastAPI"),
  Nx: el("Nx", 0, "Next.js"),
  Pg: el("Pg", 0, "PostgreSQL"),
  Aw: el("Aw", 0, "AWS"),
  Dk: el("Dk", 0, "Docker"),
  // the filters
  Ag: el("Ag", 47, "Agents"),
  Rg: el("Rg", 0, "RAG"),
  Ev: el("Ev", 0, "Evals"),
  Sy: el("Sy", 0, "Systems"),
  Ex: el("Ex", 0, "Experiments"),
};

/** `[P][Ar][Th]` on the first line, `[S]ood` on the second. */
export const NAME_TILES: readonly Element[] = [
  ELEMENTS.P,
  ELEMENTS.Ar,
  ELEMENTS.Th,
  ELEMENTS.S,
];

export const LOGO_TILE: Element = ELEMENTS.Pa;

/** Label as it appears in content → element symbol. */
export const STACK_TILES: Record<string, string> = {
  Python: "Py",
  Rust: "Rs",
  TypeScript: "Ts",
  PySpark: "Ps",
  PyTorch: "Pt",
  BioBERT: "Bb",
  LangGraph: "Lg",
  FastAPI: "Fa",
  "Next.js": "Nx",
  PostgreSQL: "Pg",
  AWS: "Aw",
  Docker: "Dk",
  Agents: "Ag",
  RAG: "Rg",
  Evals: "Ev",
  Systems: "Sy",
  Experiments: "Ex",
};

/** Stable 100–199 so invented elements never collide with real numbers. */
function pseudoNumber(label: string): number {
  let h = 7;
  for (const c of label) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 100) + 100;
}

function pseudoSymbol(label: string): string {
  const letters = label.replace(/[^a-z]/gi, "");
  const first = letters.charAt(0).toUpperCase();
  const second = letters.charAt(1).toLowerCase();
  return `${first}${second}`;
}

/** Any label can wear a tile. Known ones get their element; unknown ones get a stable stand-in. */
export function tileFor(label: string): Element {
  const known = ELEMENTS[STACK_TILES[label] ?? label];
  if (known) return known;
  return el(pseudoSymbol(label), pseudoNumber(label), label);
}

/** `"Rust · Axum · Rayon"` → `["Rs", "Ax", "Ra"]`, at most five. */
export function stackSymbols(stack: string): string[] {
  return stack
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((s) => tileFor(s).symbol);
}
