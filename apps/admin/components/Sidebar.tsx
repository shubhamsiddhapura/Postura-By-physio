"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Stethoscope,
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
  { label: "Blogs", href: "/blogs", icon: FileText },
  { label: "Testimonials", href: "/testimonials", icon: MessageSquareQuote, disabled: true },
  { label: "Services", href: "/services", icon: Stethoscope, disabled: true },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Settings", href: "/settings", icon: Settings, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-gray-900 text-white">
          <span className="text-sm font-semibold">P</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-900">Postura</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          const Icon = item.icon;
          const content = (
            <>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.disabled ? (
                <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                  Soon
                </span>
              ) : null}
            </>
          );

          const baseClass = cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            item.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-600"
          );

          if (item.disabled) {
            return (
              <div key={item.href} className={baseClass}>
                {content}
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={baseClass}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-500">
          <p className="font-medium text-gray-700">Dr. Priyanshi Pandya</p>
          <p className="mt-0.5">Postura by Physio</p>
        </div>
      </div>
    </aside>
  );
}
