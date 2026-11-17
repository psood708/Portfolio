/**
 * Pixel-art quantisation into the site palette. Pure, so the browser
 * portrait and the build-time favicon script agree on every colour.
 */

export type RGB = [number, number, number];

export const PALETTE: { name: string; rgb: RGB }[] = [
  { name: "tar", rgb: [11, 12, 10] },
  { name: "lab", rgb: [15, 47, 37] },
  { name: "element", rgb: [47, 122, 90] },
  { name: "crystal", rgb: [127, 220, 245] },
  { name: "hazmat", rgb: [242, 194, 48] },
  { name: "sand", rgb: [201, 154, 91] },
  { name: "smoke", rgb: [154, 156, 147] },
  { name: "bone", rgb: [236, 233, 223] },
];

/** The resolve: 48px blocks sharpening to 6px. */
export const PIXEL_START = 48;
export const PIXEL_END = 6;

/** Nearest palette entry by Euclidean distance in RGB. */
export function nearest(rgb: RGB): RGB {
  let best = PALETTE[0].rgb;
  let dist = Infinity;
  for (const p of PALETTE) {
    const d =
      (p.rgb[0] - rgb[0]) ** 2 + (p.rgb[1] - rgb[1]) ** 2 + (p.rgb[2] - rgb[2]) ** 2;
    if (d < dist) {
      dist = d;
      best = p.rgb;
    }
  }
  return best;
}

export type Quantised = { cols: number; rows: number; colors: RGB[] };

/** Average every `block`×`block` cell of RGBA pixel data, then snap it to the palette. */
export function quantizeBlocks(data: Uint8ClampedArray, w: number, h: number, block: number): Quantised {
  const cols = Math.ceil(w / block);
  const rows = Math.ceil(h / block);
  const colors: RGB[] = [];
  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      const yEnd = Math.min(h, (by + 1) * block);
      const xEnd = Math.min(w, (bx + 1) * block);
      for (let y = by * block; y < yEnd; y++) {
        for (let x = bx * block; x < xEnd; x++) {
          const i = (y * w + x) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n++;
        }
      }
      colors.push(nearest([r / n, g / n, b / n]));
    }
  }
  return { cols, rows, colors };
}
