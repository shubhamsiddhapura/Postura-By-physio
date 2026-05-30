import { cn } from "@/lib/utils";

/** Single filled star path (24×24 viewBox), matches Lucide “Star” silhouette. */
const STAR_D =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

export function TestimonialStarGlyph({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "h-6 w-6 shrink-0",
        filled ? "text-[#FF9000]" : "text-gray-200",
        className
      )}
      aria-hidden
      focusable="false"
    >
      <path fill="currentColor" d={STAR_D} />
    </svg>
  );
}

/**
 * Read-only star row for list cards. Plain SVG (no Lucide) keeps scroll on
 * long grids smooth — dozens of Lucide icons each mount a heavy subtree.
 */
export function TestimonialStarRow({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rating: ${value} of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <TestimonialStarGlyph key={n} filled={n <= value} />
      ))}
    </div>
  );
}
