import { describe, it, expect } from "vitest";
import { LAB, PROJECTS } from "@/lib/content";
import { INVENTORY_FILTERS, buildInventory, filterFromHash, filterInventory } from "@/lib/inventory";

describe("inventory", () => {
  const cards = buildInventory(PROJECTS, LAB);

  it("lists every project then every experiment", () => {
    expect(cards).toHaveLength(PROJECTS.length + LAB.length);
    expect(cards.slice(0, PROJECTS.length).every((c) => c.kind === "batch")).toBe(true);
    expect(cards.slice(PROJECTS.length).every((c) => c.kind === "experiment")).toBe(true);
  });

  it("filters by tag and by experiments", () => {
    expect(filterInventory(cards, "Experiments").every((c) => c.kind === "experiment")).toBe(true);
    expect(filterInventory(cards, "Experiments")).toHaveLength(LAB.length);
    const rag = filterInventory(cards, "RAG");
    expect(rag.length).toBeGreaterThan(0);
    expect(rag.every((c) => c.filters.includes("RAG"))).toBe(true);
    expect(filterInventory(cards, "All")).toHaveLength(cards.length);
  });

  it("reads the filter from the hash", () => {
    expect(filterFromHash("#experiments")).toBe("Experiments");
    expect(filterFromHash("")).toBe("All");
    expect(filterFromHash("#nope")).toBe("All");
    expect(INVENTORY_FILTERS).toEqual(["All", "Agents", "RAG", "Evals", "Systems", "Experiments"]);
  });
});
