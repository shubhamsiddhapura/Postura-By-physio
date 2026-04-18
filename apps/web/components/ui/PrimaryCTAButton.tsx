"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PrimaryCTAButtonProps = {
  href: string;
  label: string;
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
  size = "md",
  arrowVariant = "light",
  className,
  onClick,
  disabled = false,
  type = "button",
}: PrimaryCTAButtonProps) {
  const baseButtonClasses =
    "inline-flex items-center gap-3 rounded-full bg-secondary text-[#FEF9E0] shadow-sm transition hover:brightness-80";

  const sizeClasses =
    size === "md"
      ? "px-6 py-3 text-sm"
      : "px-5 py-3 text-xs font-normal md:text-sm";

  const badgeSizeClasses =
    size === "md"
      ? "right-5 top-3 h-7 w-7"
      : "-right-3 top-3 h-6 w-6";

  const badgeVariantClasses =
    arrowVariant === "light" ? "bg-[#FEF9E0]" : "bg-primary";

  const iconColorClasses =
    arrowVariant === "light" ? "text-primary" : "text-[#FEF9E0]";

  // Check if href is an external URL
  const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");

  const buttonStateClasses = disabled
    ? "opacity-60 cursor-not-allowed pointer-events-none hover:brightness-100"
    : "";

  return (
    <div
      className={`group relative inline-flex items-center transform transition-transform duration-300 hover:scale-105 ${
        className ?? ""
      }`}
    >
      {onClick ? (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`${baseButtonClasses} ${sizeClasses} ${buttonStateClasses}`}
          aria-disabled={disabled}
        >
          {label}
        </button>
      ) : isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseButtonClasses} ${sizeClasses} ${buttonStateClasses}`}
          aria-disabled={disabled}
        >
          {label}
        </a>
      ) : (
        <Link
          href={href}
          className={`${baseButtonClasses} ${sizeClasses} ${buttonStateClasses}`}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
        >
          {label}
        </Link>
      )}
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
