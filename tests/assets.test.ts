import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { labImage, pixelStamp, portraitImage, projectImage } from "@/lib/assets";

describe("assets", () => {
  const root = mkdtempSync(join(tmpdir(), "lab-assets-"));
  mkdirSync(join(root, "public", "work"), { recursive: true });
  mkdirSync(join(root, "public", "lab"), { recursive: true });
  writeFileSync(join(root, "public", "work", "x.png"), "");
  writeFileSync(join(root, "public", "lab", "y.webp"), "");

  it("resolves project and lab images by slug", () => {
    expect(projectImage("x", root)).toBe("/work/x.png");
    expect(projectImage("missing", root)).toBe(null);
    expect(labImage("y", root)).toBe("/lab/y.webp");
  });

  it("portrait and stamp are null until the files exist", () => {
    expect(portraitImage(root)).toBe(null);
    expect(pixelStamp(root)).toBe(null);
    writeFileSync(join(root, "public", "portrait.jpg"), "");
    writeFileSync(join(root, "public", "pixel-portrait.png"), "");
    expect(portraitImage(root)).toBe("/portrait.jpg");
    expect(pixelStamp(root)).toBe("/pixel-portrait.png");
  });
});
