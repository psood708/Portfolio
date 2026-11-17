// Quantises public/portrait.{jpg,png,webp} into the lab palette and writes
// public/pixel-portrait.png (64px, footer stamp) and app/icon.png (256px,
// favicon). No portrait, no files — app/icon.svg stays the icon.
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PALETTE = [
  [11, 12, 10], [15, 47, 37], [43, 112, 83], [127, 220, 245],
  [242, 194, 48], [201, 154, 91], [154, 156, 147], [236, 233, 223],
];

const portrait = ["jpg", "png", "webp"].map((e) => join(ROOT, "public", `portrait.${e}`)).find(existsSync);
if (!portrait) {
  console.log("[make-icon] no portrait, keeping icon.svg");
  process.exit(0);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("[make-icon] sharp unavailable, keeping icon.svg");
  process.exit(0);
}

const nearest = ([r, g, b]) => {
  let best = PALETTE[0];
  let dist = Infinity;
  for (const p of PALETTE) {
    const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
    if (d < dist) { dist = d; best = p; }
  }
  return best;
};

const SIZE = 32;
const { data } = await sharp(portrait).resize(SIZE, SIZE, { fit: "cover", kernel: "nearest" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(SIZE * SIZE * 3);
for (let i = 0; i < SIZE * SIZE; i++) {
  const [r, g, b] = nearest([data[i * 3], data[i * 3 + 1], data[i * 3 + 2]]);
  out[i * 3] = r; out[i * 3 + 1] = g; out[i * 3 + 2] = b;
}
const sprite = sharp(out, { raw: { width: SIZE, height: SIZE, channels: 3 } });
writeFileSync(join(ROOT, "public", "pixel-portrait.png"), await sprite.clone().resize(64, 64, { kernel: "nearest" }).png().toBuffer());
writeFileSync(join(ROOT, "app", "icon.png"), await sprite.clone().resize(256, 256, { kernel: "nearest" }).png().toBuffer());
console.log("[make-icon] wrote public/pixel-portrait.png and app/icon.png");
