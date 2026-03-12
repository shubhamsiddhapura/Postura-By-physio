"use client";

import { CSSProperties } from "react";
import { useInView } from "../../hooks/useInView";
import { cn } from "../../lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay before the animation starts, in milliseconds */
  delay?: number;
  /** Direction the element travels FROM as it fades in */
  direction?: Direction;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Distance (px) the element travels */
  distance?: number;
};

const getInitialTransform = (
  direction: Direction,
  distance: number
): string => {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    default:
      return "none";
  }
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 650,
  distance = 28,
}: FadeInProps) {
  const { ref, isInView } = useInView({ threshold: 0.12 });

  const style: CSSProperties = {
    opacity: isInView ? 1 : 0,
    transform: isInView ? "translate(0,0)" : getInitialTransform(direction, distance),
    transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1), transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div ref={ref} className={cn(className)} style={style}>
      {children}
    </div>
  );
}
