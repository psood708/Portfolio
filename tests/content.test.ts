import { describe, it, expect } from "vitest";
import * as C from "@/lib/content";
import { PORTFOLIO_CONTEXT } from "@/lib/portfolio-context";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : p;
  });

describe("content", () => {
  it("purity bands", () => {
    expect(C.bioForPurity(99.1)).toBe(C.BIO_REGISTERS[2].text);
    expect(C.bioForPurity(90)).toBe(C.BIO_REGISTERS[1].text);
    expect(C.bioForPurity(60)).toBe(C.BIO_REGISTERS[0].text);
    expect(C.bioForPurity(10)).toBe(C.BIO_REGISTERS[3].text);
    expect(C.purityLabel(99.1)).toBe("lab grade");
    expect(C.purityLabel(90)).toBe("clean");
    expect(C.purityLabel(60)).toBe("cut");
    expect(C.purityLabel(10)).toBe("contaminated");
    expect(C.PURITY_MAX).toBe(99.1);
    expect(C.PURITY_DEFAULT).toBe(99.1);
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
    expect(C.LAB.map((l) => l.slug)).toEqual([
      "facility-compliance",
      "finfun",
      "pairs-trading",
      "momacmo",
    ]);
    for (const l of C.LAB) expect(["shipped", "reacting", "broke it"]).toContain(l.status);
  });

  it("site copy exists", () => {
    expect(C.SITE.title).toBe("Applied AI engineer");
    expect(C.SITE.roleLine).toBe("APPLIED AI ENGINEER · ASPECT RATIO · PUNE");
    expect(C.SITE.stamp).toBe("99.1% PURE · NO HALF MEASURES");
    expect(C.CONTACT_LABEL).toBe("Say my name");
    expect(C.RV_COPY.cta).toBe("open the RV ↗");
    expect(C.FOOTER.sendoff).toBe("Say my name.");
    expect(C.PRINCIPLES.map((p) => p.title)).toEqual([
      "Respect the chemistry",
      "Know your purity",
      "No half measures",
    ]);
  });

  it("grounding doc is stable and still mentions every project", () => {
    for (const p of C.PROJECTS) expect(PORTFOLIO_CONTEXT).toContain(p.name);
    expect(PORTFOLIO_CONTEXT).not.toMatch(/cook/i);
  });

  it("never calls Parth a chemist", () => {
    for (const dir of ["app", "components", "lib"]) {
      for (const f of walk(dir)) {
        expect(readFileSync(f, "utf8"), f).not.toMatch(/\bchemist\b/i);
      }
    }
  });

  it("no drug vocabulary anywhere in source", () => {
    for (const dir of ["app", "components", "lib"]) {
      for (const f of walk(dir)) {
        const src = readFileSync(f, "utf8");
        expect(src, f).not.toMatch(/\b(cook|cooking|cooked|meth)\b/i);
      }
    }
  });
});
