import { describe, it, expect } from "vitest";
import { chromatogramPath } from "@/lib/chromatogram";

describe("chromatogram", () => {
  it("is deterministic for the same seed", () => {
    expect(chromatogramPath("memoryweave", 400, 200)).toBe(chromatogramPath("memoryweave", 400, 200));
  });
  it("differs across seeds", () => {
    expect(chromatogramPath("memoryweave", 400, 200)).not.toBe(chromatogramPath("ollive", 400, 200));
  });
  it("starts at the left edge and has at least `peaks` curve segments", () => {
    const d = chromatogramPath("x", 400, 200, 7);
    expect(d.startsWith("M 0")).toBe(true);
    expect((d.match(/Q /g) ?? []).length).toBeGreaterThanOrEqual(7);
  });
});
