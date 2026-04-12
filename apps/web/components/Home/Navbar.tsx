"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { useState, useEffect } from "react";
import { scrollToHash, useSmoothHashScroll } from "../../lib/scroll";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Who Can Join", href: "#who-can-join" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "/contact-us" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // Change background when scrolled past hero section (approximately 100vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsScrolled(scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useSmoothHashScroll({ extraOffsetPx: 12 });

  const handleNavClick = (href: string, opts?: { closeMenu?: boolean }) => (e: React.MouseEvent) => {
    // Let normal navigation happen for non-hash links
    if (!href.startsWith("#")) {
      if (opts?.closeMenu) setIsMenuOpen(false);
      return;
    }

    // Hash links:
    // - on Home: smooth scroll
    // - on other pages: navigate to home with hash
    e.preventDefault();
    if (opts?.closeMenu) setIsMenuOpen(false);

    if (isHome) {
      scrollToHash(href, { extraOffsetPx: 12 });
    } else {
      router.push(`/${href}`);
    }
  };

  return (
    <header className="fixed inset-x-0 top-3 z-50">
      <div className="mx-auto max-w-[90vw] md:px-4 py-3">
        <div
          data-scroll-header
          className={`flex items-center justify-between rounded-tl-lg rounded-bl-3xl rounded-tr-3xl rounded-br-lg backdrop-blur-md pl-4 py-3 shadow-sm transition-all duration-300 ${isScrolled
              ? "bg-primary/60"
              : "bg-white/10"
            }`}
        >
          <Link
            href="/"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                scrollToHash("#home", { extraOffsetPx: 12 });
              }
            }}
            className="flex items-center gap-3"
          >
            <Image
              src="/navbar-logo.png"
              alt="Postura by Physio logo"
              width={150}
              height={5}
              priority
              className="md:h-14 h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick(item.href)}
                className="text-sm font-medium transition-colors text-white hover:text-secondary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <PrimaryCTAButton
              href="/book-a-session"
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
                <X
                  className="h-6 w-6 transition-colors text-[#FEF9E0]"
                />
              ) : (
                <Menu
                  className="h-6 w-6 transition-colors text-[#FEF9E0]"
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mt-2 rounded-lg backdrop-blur-md md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isScrolled
              ? "bg-primary/60"
              : "bg-white/10"
            } ${isMenuOpen
              ? "max-h-96 opacity-100 p-4"
              : "max-h-0 opacity-0 p-0"
            }`}
        >
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick(item.href, { closeMenu: true })}
                className="text-sm font-medium transition-colors text-white hover:text-secondary "
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <PrimaryCTAButton
                href="/book-a-session"
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
