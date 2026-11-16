import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/content";

describe("smoke", () => {
  it("imports content", () => expect(SITE.name).toBe("Parth Sood"));
});
