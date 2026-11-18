"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useTransition } from "./TransitionProvider";

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode };

/**
 * `next/link` that plays the wipe first. Modified clicks, middle clicks,
 * new-tab targets and links to the current page fall through to the browser.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = useTransition();
  const pathname = usePathname();
  const url =
    typeof href === "string" ? href : String((href as { pathname?: string | null }).pathname ?? "/");

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target === "_blank") return;
    if (url.split("#")[0] === pathname) return;
    e.preventDefault();
    void navigate(url);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
