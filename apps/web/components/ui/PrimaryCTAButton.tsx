"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PrimaryCTAButtonProps = {
  href: string;
  label: string;
  /** Button surface styling */
  variant?: "filled" | "inverse";
  size?: "sm" | "md";
  /** Visual style of the arrow circle + icon only */
  arrowVariant?: "light" | "dark";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function PrimaryCTAButton({
  href,
  label,
  variant = "filled",
  size = "md",
  arrowVariant = "light",
  className,
  onClick,
  disabled = false,
  type = "button",
}: PrimaryCTAButtonProps) {
  const baseButtonClasses =
    "inline-flex items-center rounded-full shadow-sm transition hover:brightness-90";

  const surfaceClasses =
    variant === "inverse"
      ? "bg-[#FEF9E0] text-primary"
      : "bg-secondary text-[#FEF9E0]";

  // Left padding: visual breathing room before text.
  // Right padding: reserves space so the label ends before the badge circle
  // (badge is -right-3 = 12px outside the pill, 24/28px wide → occupies
  //  last ~12-16px of the pill from the inside edge).
  const sizeClasses =
    size === "md"
      ? "py-3 pl-6 pr-5 text-sm font-semibold"
      : "py-2.5 pl-5 pr-5 text-xs font-semibold md:text-sm";

  // Badge always protrudes 12 px to the right of the pill for both sizes.
  const badgeSizeClasses =
    size === "md"
      ? "-right-3 top-1/2 -translate-y-1/2 h-7 w-7"
      : "-right-3 top-1/2 -translate-y-1/2 h-6 w-6";

  const badgeVariantClasses =
    arrowVariant === "light" ? "bg-[#FEF9E0]" : "bg-primary";

  const iconColorClasses =
    arrowVariant === "light" ? "text-primary" : "text-[#FEF9E0]";

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  const buttonStateClasses = disabled
    ? "opacity-60 cursor-not-allowed pointer-events-none hover:brightness-100"
    : "";

  const innerClass = `${baseButtonClasses} ${surfaceClasses} ${sizeClasses} ${buttonStateClasses}`;

  return (
    <div
      className={`group relative inline-flex shrink-0 items-center overflow-visible transform transition-transform duration-300 hover:scale-105 ${
        className ?? ""
      }`}
    >
      {onClick ? (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={innerClass}
          aria-disabled={disabled}
        >
          {label}
        </button>
      ) : isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={innerClass}
          aria-disabled={disabled}
        >
          {label}
        </a>
      ) : (
        <Link
          href={href}
          className={innerClass}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
        >
          {label}
        </Link>
      )}

      {/* Arrow badge — sits just outside the pill's right edge */}
      <span
        className={`absolute grid place-items-center rounded-full ${badgeVariantClasses} ${badgeSizeClasses}`}
      >
        <ArrowUpRight
          className={`h-4 w-4 ${iconColorClasses} transition-transform duration-300 group-hover:rotate-45`}
        />
      </span>
    </div>
  );
}
