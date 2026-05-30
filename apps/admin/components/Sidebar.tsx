"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  MessageSquareQuote,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Blogs", href: "/blogs", icon: FileText },
  { label: "Testimonials", href: "/testimonials", icon: MessageSquareQuote },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Certifications", href: "/certifications", icon: Award },
];

export function Sidebar() {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col overflow-hidden bg-primary transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* ── Logo / brand ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10",
          collapsed ? "justify-center px-0" : "gap-3 px-5"
        )}
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl">
          <Image
            src="/admin-logo.png"
            alt="Postura logo"
            width={28}
            height={28}
            className="h-10 w-10 object-contain"
            priority
          />
        </div>

        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-sm font-bold tracking-tight text-white">
              Postura
            </p>
            <p className="truncate text-[11px] text-white/55">Admin Panel</p>
          </div>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
        {!collapsed && (
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Menu
          </p>
        )}

        <ul className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            const isPending = pendingHref === item.href;
            const Icon = item.icon;

            const baseClass = cn(
              "group relative flex items-center gap-3 rounded-xl transition-all duration-150",
              collapsed ? "h-11 w-11 justify-center p-0" : "px-3 py-2.5",
              isActive
                ? "bg-white/20 text-white shadow-sm"
                : isPending
                  ? "bg-white/10 text-white/90"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-white/65"
            );

            const iconEl = isPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <Icon className="h-4 w-4 shrink-0" />
            );

            const inner = (
              <>
                {/* Icon bento tile (visible in both states) */}
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors",
                    isActive
                      ? "bg-white/25"
                      : "bg-white/10 group-hover:bg-white/20"
                  )}
                >
                  {iconEl}
                </span>

                {/* Label — hidden when collapsed */}
                {!collapsed && (
                  <span className="truncate text-sm font-medium leading-none">
                    {item.label}
                  </span>
                )}

                {/* "Soon" badge */}
                {!collapsed && item.disabled && (
                  <span className="ml-auto rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white/50">
                    Soon
                  </span>
                )}

                {/* Active dot when collapsed */}
                {collapsed && isActive && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
                )}

                {/* Tooltip shown only when collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </>
            );

            if (item.disabled) {
              return (
                <li key={item.href}>
                  <div className={baseClass}>{inner}</div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={baseClass}
                  onClick={() => {
                    if (!isActive) setPendingHref(item.href);
                  }}
                >
                  {inner}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User card ────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="mb-2 rounded-xl bg-white/10 p-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/20 text-sm font-bold text-white">
                D
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-[13px] font-semibold text-white">
                  Dr. Priyanshi Pandya
                </p>
                <p className="truncate text-[11px] text-white/50">
                  Postura by Physio
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-2 flex justify-center">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-bold text-white">
              D
            </div>
          </div>
        )}

        {/* ── Collapse toggle ──────────────────────────────────── */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-white/60 transition-all hover:bg-white/10 hover:text-white",
            collapsed && "h-9 w-9 mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <>
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>

        {/* ── Logout ─────────────────────────────────────────── */}
        <button
          onClick={async () => {
            if (loggingOut) return;
            setLoggingOut(true);
            try {
              await fetch("/api/admin/logout", { method: "POST" });
            } finally {
              window.location.href = "/login";
            }
          }}
          aria-label="Logout"
          className={cn(
            "mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-white/60 transition-all hover:bg-white/10 hover:text-white",
            collapsed && "h-9 w-9 mx-auto"
          )}
        >
          <LogOut className="h-3.5 w-3.5" />
          {!collapsed && (
            <span className="text-xs font-medium">
              {loggingOut ? "Logging out…" : "Logout"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
