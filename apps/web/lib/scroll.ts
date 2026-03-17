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
  /**
   * When true (default), performs a quick correction pass after the first scroll.
   * This improves accuracy on responsive layouts where fonts/images shift content.
   */
  correctAfterScroll?: boolean;
  /** Allowed px error between the target's top and the desired offset */
  tolerancePx?: number;
};

function getHeaderOffsetPx(
  headerSelector: string,
  extraOffsetPx: number
): number {
  const headerEl =
    (document.querySelector(headerSelector) as HTMLElement | null) ??
    (document.querySelector("header") as HTMLElement | null);
  if (!headerEl) return extraOffsetPx;

  // `bottom` includes header height + any top offset (your header is `top-3`).
  const rect = headerEl.getBoundingClientRect();
  return Math.max(0, rect.bottom) + extraOffsetPx;
}

function getNegativeMarginCompensationPx(target: HTMLElement): number {
  const marginTop = Number.parseFloat(
    window.getComputedStyle(target).marginTop || "0"
  );
  return marginTop < 0 ? -marginTop : 0;
}

function computeDesiredScrollTop(
  target: HTMLElement,
  headerSelector: string,
  extraOffsetPx: number
) {
  const headerOffset = getHeaderOffsetPx(headerSelector, extraOffsetPx);
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const negativeMarginCompensation = getNegativeMarginCompensationPx(target);
  return Math.max(0, targetTop - headerOffset + negativeMarginCompensation);
}

export function scrollToHash(
  hash: string,
  {
    headerSelector = "[data-scroll-header]",
    extraOffsetPx = 12,
    updateHash = true,
    behavior = "smooth",
    correctAfterScroll = true,
    tolerancePx = 6,
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

  const desiredTop = computeDesiredScrollTop(target, headerSelector, extraOffsetPx);

  if (updateHash) window.history.pushState(null, "", hash);
  window.scrollTo({
    top: desiredTop,
    behavior,
  });

  if (!correctAfterScroll) return;

  // Correction pass: after layout settles (responsive fonts/images), re-measure and nudge.
  // This keeps landing positions consistent across breakpoints.
  const correct = () => {
    const currentDesiredTop = computeDesiredScrollTop(
      target,
      headerSelector,
      extraOffsetPx
    );
    const delta = currentDesiredTop - window.scrollY;
    if (Math.abs(delta) <= tolerancePx) return;
    window.scrollTo({ top: currentDesiredTop, behavior });
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(correct);
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
        // Two RAFs: allow layout to settle before first measurement.
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            scrollToHash(window.location.hash, {
              ...rest,
              behavior: "smooth",
              correctAfterScroll: true,
            });
          });
        });
      }
    };

    handle();
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, [enabled, rest.headerSelector, rest.extraOffsetPx]);
}

