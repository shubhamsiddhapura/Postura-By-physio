"use client";

import { useEffect } from "react";

export type ScrollToHashOptions = {
  /** CSS selector for the fixed header element used to compute offset */
  headerSelector?: string;
  /** Extra pixels to pad below the header so the section title has breathing room */
  extraOffsetPx?: number;
  /** Whether to update the URL hash */
  updateHash?: boolean;
  behavior?: ScrollBehavior;
};

export function scrollToHash(
  hash: string,
  {
    headerSelector = "header",
    extraOffsetPx = 12,
    updateHash = true,
    behavior = "smooth",
  }: ScrollToHashOptions = {}
) {
  if (typeof window === "undefined") return;
  if (!hash?.startsWith("#")) return;

  if (hash === "#home") {
    if (updateHash) window.history.pushState(null, "", hash);
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.querySelector(hash) as HTMLElement | null;
  if (!target) return;

  const headerEl = document.querySelector(headerSelector) as HTMLElement | null;
  const headerOffset = (headerEl?.offsetHeight ?? 0) + extraOffsetPx;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  if (updateHash) window.history.pushState(null, "", hash);
  window.scrollTo({
    top: Math.max(0, targetTop - headerOffset),
    behavior,
  });
}

export type UseSmoothHashScrollOptions = Omit<
  ScrollToHashOptions,
  "behavior" | "updateHash"
> & {
  /** When true, auto-scrolls to the current hash on mount and on hashchange */
  enabled?: boolean;
};

export function useSmoothHashScroll(options: UseSmoothHashScrollOptions = {}) {
  const { enabled = true, ...rest } = options;

  useEffect(() => {
    if (!enabled) return;

    const handle = () => {
      if (window.location.hash) {
        window.requestAnimationFrame(() =>
          scrollToHash(window.location.hash, { ...rest, behavior: "smooth" })
        );
      }
    };

    handle();
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, [enabled, rest.headerSelector, rest.extraOffsetPx]);
}

