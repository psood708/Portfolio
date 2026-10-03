import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Cost control for the public /api/ask endpoint.
 *
 * Two limits, because they fail differently. The per-IP sliding window stops one
 * person hammering the bar; the global fixed window is the backstop against a
 * spread-out flood that slips under the per-IP limit. Either tripping degrades
 * the answer to the canned corpus rather than erroring — a visitor who hits the
 * limit should get a worse answer, not a broken page.
 *
 * Without the Upstash env vars this no-ops, so `npm run dev` needs no Redis.
 * That is a deliberate hole: deployments must set the vars, which the README and
 * .env.example both say.
 */

const PER_IP = { limit: 8, window: "10 m" } as const;
const GLOBAL = { limit: 300, window: "1 d" } as const;

const configured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let warned = false;

const redis = configured ? Redis.fromEnv() : null;

const perIp = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_IP.limit, PER_IP.window),
      prefix: "ask:ip",
      analytics: false,
    })
  : null;

const global = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(GLOBAL.limit, GLOBAL.window),
      prefix: "ask:global",
      analytics: false,
    })
  : null;

export type LimitResult = { ok: true } | { ok: false; reason: "ip" | "global" };

/** Reads the caller's IP from the proxy headers Vercel and most hosts set. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export async function checkLimit(ip: string): Promise<LimitResult> {
  if (!perIp || !global) {
    if (!warned) {
      warned = true;
      console.warn(
        "[ask] UPSTASH_REDIS_REST_URL/TOKEN unset — rate limiting is OFF. " +
          "Set both before deploying a public build.",
      );
    }
    return { ok: true };
  }

  // Global first: if the day's budget is gone, no point spending an IP token.
  const day = await global.limit("all");
  if (!day.success) return { ok: false, reason: "global" };

  const mine = await perIp.limit(ip);
  if (!mine.success) return { ok: false, reason: "ip" };

  return { ok: true };
}
