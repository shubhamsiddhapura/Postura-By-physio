import {
  Activity,
  Armchair,
  Award,
  Brain,
  Dumbbell,
  Flame,
  Footprints,
  HandHeart,
  Heart,
  LaptopMinimal,
  Leaf,
  LucideIcon,
  Moon,
  MousePointer2,
  PersonStanding,
  Shield,
  Sparkles,
  Stethoscope,
  Sun,
  Target,
  Zap,
} from "lucide-react";
import type { IconName } from "@repo/types";

/**
 * Name -> Lucide component map.
 * Keep in sync with `ICON_NAMES` in `@repo/types`.
 */
export const ICON_MAP: Record<IconName, LucideIcon> = {
  Armchair,
  Brain,
  Dumbbell,
  Footprints,
  HandHeart,
  LaptopMinimal,
  MousePointer2,
  PersonStanding,
  Activity,
  Heart,
  Stethoscope,
  Sparkles,
  Target,
  Zap,
  Shield,
  Award,
  Leaf,
  Sun,
  Moon,
  Flame,
};

/** Lookup with safe fallback so unknown names don't crash the render. */
export function iconFor(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles;
  return (ICON_MAP as Record<string, LucideIcon>)[name] ?? Sparkles;
}
