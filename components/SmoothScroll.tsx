"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * Lenis in root mode attaches to the window and renders nothing, so it sits
 * beside the app rather than around it: turning it on after hydration does
 * not remount the tree. Touch devices and reduced-motion viewers keep native
 * scrolling.
 */
export default function SmoothScroll() {
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(hover: none)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSmooth(!coarse.matches && !calm.matches);
    sync();
    coarse.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      coarse.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  if (!smooth) return null;
  return <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }} />;
}
