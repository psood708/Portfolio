import { describe, it, expect } from "vitest";
import { shouldPlayIntro, markIntroSeen, INTRO_KEY, INTRO_MS, INTRO_CALM_MS, TILE_AT } from "@/lib/intro";

describe("intro", () => {
  it("plays once per storage", () => {
    const store = new Map<string, string>();
    const s = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    expect(shouldPlayIntro(s)).toBe(true);
    markIntroSeen(s);
    expect(store.get(INTRO_KEY)).toBe("1");
    expect(shouldPlayIntro(s)).toBe(false);
  });

  it("plays when storage is unavailable", () => {
    expect(shouldPlayIntro(null)).toBe(true);
    expect(
      shouldPlayIntro({
        getItem: () => {
          throw new Error("private");
        },
      }),
    ).toBe(true);
    expect(() =>
      markIntroSeen({
        setItem: () => {
          throw new Error("private");
        },
      }),
    ).not.toThrow();
  });

  it("fits the budget", () => {
    expect(INTRO_MS).toBeLessThanOrEqual(2800);
    expect(INTRO_CALM_MS).toBeLessThanOrEqual(450);
    expect(Math.max(...TILE_AT)).toBeLessThan(INTRO_MS);
    expect(TILE_AT).toHaveLength(4);
  });
});
