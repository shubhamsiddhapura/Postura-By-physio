"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Who Can Join", href: "#who-can-join" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-5 z-50">
      <div className="mx-auto max-w-[90vw] md:px-4 py-3">
        <div className="flex items-center justify-between rounded-tl-lg rounded-bl-3xl rounded-tr-3xl rounded-br-lg bg-white pl-4 py-3 shadow-sm">
          <Link href="#home" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Postura by Physio logo"
              width={150}
              height={5}
              priority
              className="md:h-14 h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-900 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <PrimaryCTAButton
              href="#book-session"
              label="Book Session"
              size="md"
              className="hidden pr-8 md:block"
            />

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden pr-5 transition-transform duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mt-2 rounded-lg bg-white shadow-lg md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 p-4"
              : "max-h-0 opacity-0 p-0"
          }`}
        >
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-gray-900 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <PrimaryCTAButton
                href="#book-session"
                label="Book Session"
                size="sm"
                className="justify-center"
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
