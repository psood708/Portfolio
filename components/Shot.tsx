"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { maskIn, viewportOnce } from "@/lib/motion";
import SpectrumPlate from "./SpectrumPlate";

type Props = {
  src: string | null;
  alt: string;
  seed: string;
  symbols: string[];
  number: string;
  ratio?: string;
  sizes?: string;
  className?: string;
};

/**
 * The screenshot slot. With an image: `next/image` under a crystal tint that
 * lifts on hover, unmasked on scroll. Without: the spectrum plate.
 */
export default function Shot({
  src,
  alt,
  seed,
  symbols,
  number,
  ratio = "16/10",
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: Props) {
  return (
    <motion.div
      data-cursor-invert
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
      variants={maskIn}
      className={`relative w-full overflow-hidden rounded-[16px] ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <>
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div
            aria-hidden
            className="absolute inset-0 bg-crystal opacity-60 transition-opacity duration-500 group-hover:opacity-0"
            style={{ mixBlendMode: "multiply" }}
          />
        </>
      ) : (
        <SpectrumPlate seed={seed} symbols={symbols} number={number} />
      )}
    </motion.div>
  );
}
