/**
 * A deterministic chromatogram trace for a project's spectrum plate: the
 * same slug always draws the same peaks, so the plate is stable across
 * renders and server/client.
 */

function hash(seed: string): () => number {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

/** SVG path `d`: a baseline at 82% height with `peaks` bumps. */
export function chromatogramPath(seed: string, width: number, height: number, peaks = 7): string {
  const rnd = hash(seed);
  const base = height * 0.82;
  const xs = Array.from({ length: peaks }, () => 0.06 + rnd() * 0.88).sort((a, b) => a - b);
  let d = `M 0 ${base.toFixed(1)}`;
  let prev = 0;
  for (const fx of xs) {
    const x = fx * width;
    const peak = height * (0.15 + rnd() * 0.55);
    const w = width * (0.012 + rnd() * 0.03);
    d += ` L ${(x - w).toFixed(1)} ${base.toFixed(1)}`;
    d += ` Q ${x.toFixed(1)} ${(base - peak).toFixed(1)} ${(x + w).toFixed(1)} ${base.toFixed(1)}`;
    prev = x + w;
  }
  if (prev < width) d += ` L ${width} ${base.toFixed(1)}`;
  return d;
}
