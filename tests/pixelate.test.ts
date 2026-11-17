import { describe, it, expect } from "vitest";
import { PALETTE, PIXEL_END, PIXEL_START, nearest, quantizeBlocks } from "@/lib/pixelate";

describe("pixelate", () => {
  it("snaps colours to the lab palette", () => {
    expect(nearest([0, 0, 0])).toEqual(PALETTE.find((p) => p.name === "tar")!.rgb);
    expect(nearest([250, 200, 50])).toEqual(PALETTE.find((p) => p.name === "hazmat")!.rgb);
    expect(nearest([120, 220, 245])).toEqual(PALETTE.find((p) => p.name === "crystal")!.rgb);
    expect(PALETTE).toHaveLength(8);
  });

  it("averages each block and quantises it", () => {
    const hazmat = PALETTE.find((p) => p.name === "hazmat")!.rgb;
    const data = new Uint8ClampedArray(4 * 4 * 4);
    for (let i = 0; i < 16; i++) {
      data[i * 4] = 242;
      data[i * 4 + 1] = 194;
      data[i * 4 + 2] = 48;
      data[i * 4 + 3] = 255;
    }
    const q = quantizeBlocks(data, 4, 4, 2);
    expect(q.cols).toBe(2);
    expect(q.rows).toBe(2);
    expect(q.colors).toEqual([hazmat, hazmat, hazmat, hazmat]);
  });

  it("resolves from coarse to fine", () => {
    expect(PIXEL_START).toBe(48);
    expect(PIXEL_END).toBe(6);
  });
});
