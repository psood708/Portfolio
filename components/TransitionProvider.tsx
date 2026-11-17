"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { EASE_WIPE } from "@/lib/motion";

type Ctx = {
  /** Cover the screen, then push the route. The new page calls `reveal`. */
  navigate: (href: string) => Promise<void>;
  /** Uncover, bottom to top. A no-op when nothing is covering. */
  reveal: () => void;
};

const TransitionContext = createContext<Ctx>({
  navigate: async () => {},
  reveal: () => {},
});

const COVER = 0.26;
const LAB = 0.22;
const OVERLAP = 0.12;

/**
 * The page wipe. Two full-screen layers, hazmat then lab green, scale up from
 * the bottom to cover the page before a route change and shrink toward the
 * top once the new page has mounted — a continuous upward sweep that fits the
 * 600 ms budget. Reduced motion skips straight to the push.
 */
export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const calm = useReducedMotion();
  const hazmat = useMotionValue(0);
  const lab = useMotionValue(0);
  const origin = useMotionValue("bottom");
  const covering = useRef(false);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    if (!covering.current) return;
    covering.current = false;
    if (safety.current) clearTimeout(safety.current);
    origin.set("top");
    animate(lab, 0, { duration: LAB, ease: EASE_WIPE });
    animate(hazmat, 0, { duration: COVER, ease: EASE_WIPE, delay: OVERLAP });
  }, [hazmat, lab, origin]);

  const navigate = useCallback(
    async (href: string) => {
      if (calm || covering.current) {
        router.push(href);
        return;
      }
      covering.current = true;
      origin.set("bottom");
      hazmat.set(0);
      lab.set(0);
      animate(hazmat, 1, { duration: COVER, ease: EASE_WIPE });
      await animate(lab, 1, { duration: LAB, ease: EASE_WIPE, delay: OVERLAP });
      router.push(href);
      // If no template mounts (same route, failed push), never stay covered.
      safety.current = setTimeout(reveal, 1500);
    },
    [calm, hazmat, lab, origin, router, reveal],
  );

  const value = useMemo(() => ({ navigate, reveal }), [navigate, reveal]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-hazmat"
        style={{ scaleY: hazmat, originY: origin }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[81] bg-lab"
        style={{ scaleY: lab, originY: origin }}
      />
    </TransitionContext.Provider>
  );
}

export function useTransition(): Ctx {
  return useContext(TransitionContext);
}
