"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element); // animate once, no re-trigger
        }
      },
      { threshold: 0.12, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}
