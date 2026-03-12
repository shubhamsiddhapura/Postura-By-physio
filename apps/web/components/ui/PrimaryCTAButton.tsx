import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PrimaryCTAButtonProps = {
  href: string;
  label: string;
  size?: "sm" | "md";
  className?: string;
};

export function PrimaryCTAButton({
  href,
  label,
  size = "md",
  className,
}: PrimaryCTAButtonProps) {
  const baseButtonClasses =
    "group inline-flex items-center gap-3 rounded-full bg-secondary text-white shadow-sm transition hover:opacity-95";

  const sizeClasses =
    size === "md"
      ? "px-6 py-4 text-sm"
      : "px-5 py-3 text-xs font-semibold md:text-sm";

  const badgeSizeClasses =
    size === "md"
      ? "right-5 top-3 h-7 w-7"
      : "-right-3 top-3 h-6 w-6";

  return (
    <div className={`relative inline-flex items-center ${className ?? ""}`}>
      <Link href={href} className={`${baseButtonClasses} ${sizeClasses}`}>
        {label}
      </Link>
      <span
        className={`absolute grid place-items-center rounded-full bg-[#FEF9E0] ${badgeSizeClasses}`}
      >
        <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </div>
  );
}
