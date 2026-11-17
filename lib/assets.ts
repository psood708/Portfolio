/**
 * Server-only. Resolves images by slug from `public/`, so dropping a file in
 * is all it takes: `public/work/<slug>.png`, `public/lab/<slug>.png`,
 * `public/portrait.jpg`. Only import from server components.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const EXTS = ["png", "webp", "jpg"] as const;

function find(dir: string, base: string, root: string): string | null {
  for (const ext of EXTS) {
    if (existsSync(join(root, "public", dir, `${base}.${ext}`))) {
      return `/${dir ? `${dir}/` : ""}${base}.${ext}`;
    }
  }
  return null;
}

export function projectImage(slug: string, root = process.cwd()): string | null {
  return find("work", slug, root);
}

export function labImage(slug: string, root = process.cwd()): string | null {
  return find("lab", slug, root);
}

export function portraitImage(root = process.cwd()): string | null {
  for (const ext of ["jpg", "png", "webp"]) {
    if (existsSync(join(root, "public", `portrait.${ext}`))) return `/portrait.${ext}`;
  }
  return null;
}

/** The quantised sprite `scripts/make-icon.mjs` writes; 24px in the footer. */
export function pixelStamp(root = process.cwd()): string | null {
  return existsSync(join(root, "public", "pixel-portrait.png")) ? "/pixel-portrait.png" : null;
}
