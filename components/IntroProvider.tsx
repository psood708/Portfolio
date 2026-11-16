"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { markIntroSeen, shouldPlayIntro } from "@/lib/intro";

export type IntroPhase = "pending" | "playing" | "done";

type Ctx = {
  phase: IntroPhase;
  /** True when the reaction played this visit, so the hero can take the hand-off. */
  played: boolean;
  finish: () => void;
};

const IntroContext = createContext<Ctx>({
  phase: "pending",
  played: false,
  finish: () => {},
});

/**
 * Who owns the preloader's state: the preloader plays it, the hero's title
 * card waits for it. `pending` on the server and on the first client render
 * so nothing flashes before the decision is made.
 */
export default function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("pending");
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    let storage: Storage | null = null;
    try {
      storage = window.sessionStorage;
    } catch {
      storage = null;
    }
    if (shouldPlayIntro(storage)) {
      setPlayed(true);
      setPhase("playing");
    } else {
      setPhase("done");
    }
  }, []);

  const finish = useCallback(() => {
    try {
      markIntroSeen(window.sessionStorage);
    } catch {
      /* nothing to remember */
    }
    setPhase("done");
  }, []);

  return (
    <IntroContext.Provider value={{ phase, played, finish }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro(): Ctx {
  return useContext(IntroContext);
}
