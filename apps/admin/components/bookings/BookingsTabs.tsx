"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Bookings", href: "/bookings" },
  { label: "Availability", href: "/bookings/availability" },
] as const;

/**
 * Tab strip shared by the bookings list + availability editor. Placed
 * directly under the PageHeader on both pages so they feel like the same
 * section. Detail page (/bookings/[id]) deliberately doesn't render this.
 */
export function BookingsTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <nav className="-mb-px flex gap-6" aria-label="Bookings sections">
        {tabs.map((tab) => {
          const active =
            tab.href === "/bookings"
              ? pathname === "/bookings"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-primary/40 hover:text-primary"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
