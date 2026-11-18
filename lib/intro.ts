/**
 * The reaction plays once per tab. Pure helpers so the timeline and the
 * once-per-tab rule can be tested without a DOM.
 */

export const INTRO_KEY = "lab-intro";

/** Whole timeline, in ms. The spec's budget is 2.8 s. */
export const INTRO_MS = 2800;

/** Reduced-motion viewers see a still frame for this long. */
export const INTRO_CALM_MS = 450;

/** When each name tile slams in: P, Ar, Th, then S. */
export const TILE_AT = [1700, 1900, 2100, 2350] as const;

/** Other beats, for the component to read from one place. */
export const BEATS = {
  typed: 0,
  flask: 300,
  fill: 800,
  flash: 1500,
  ood: 2400,
} as const;

type Reader = Pick<Storage, "getItem">;
type Writer = Pick<Storage, "setItem">;

/** True unless this tab has already seen it. Storage that throws counts as unseen. */
export function shouldPlayIntro(storage: Reader | null | undefined): boolean {
  if (!storage) return true;
  try {
    return storage.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markIntroSeen(storage: Writer | null | undefined): void {
  if (!storage) return;
  try {
    storage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode: nothing to remember, nothing to do */
  }
}
