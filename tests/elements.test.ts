import { describe, it, expect } from "vitest";
import { ELEMENTS, NAME_TILES, LOGO_TILE, tileFor, stackSymbols } from "@/lib/elements";
import { STACK, FILTERS } from "@/lib/content";

describe("elements", () => {
  it("spells the name with real elements", () => {
    expect(NAME_TILES.map((e) => `${e.symbol}${e.number}`)).toEqual(["P15", "Ar18", "Th90", "S16"]);
    expect(LOGO_TILE).toEqual({ symbol: "Pa", number: 91, name: "Protactinium" });
    expect(ELEMENTS.Pa).toBe(LOGO_TILE);
  });

  it("maps every stack label and filter to a tile", () => {
    for (const s of [...STACK, ...FILTERS.filter((f) => f !== "All")]) {
      const t = tileFor(s);
      expect(t.symbol.length, s).toBeLessThanOrEqual(2);
      expect(t.name).toBeTruthy();
    }
  });

  it("is deterministic and bounded for unknown labels", () => {
    expect(tileFor("Axum")).toEqual(tileFor("Axum"));
    expect(tileFor("Axum").number).toBeGreaterThanOrEqual(100);
    expect(tileFor("Axum").number).toBeLessThan(200);
    expect(tileFor("Axum").symbol).toBe("Ax");
    expect(tileFor("mmap").symbol).toBe("Mm");
  });

  it("matches labels by their first word and never repeats a symbol", () => {
    expect(stackSymbols("Python 3.12 · FastAPI · Pydantic v2 · Next.js")).toEqual(["Py", "Fa", "Pd", "Nx"]);
    expect(stackSymbols("Python · LangGraph · MCP · Ollama / Groq")).toEqual(["Py", "Lg", "Mc", "Ol"]);
  });

  it("splits a stack string into at most five symbols", () => {
    expect(stackSymbols("Rust · Axum · Rayon · mmap")).toEqual(["Rs", "Ax", "Ra", "Mm"]);
    expect(stackSymbols("a · b · c · d · e · f")).toHaveLength(5);
  });
});
