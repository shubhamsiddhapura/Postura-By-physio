import Image from "next/image";
import Link from "next/link";
import { PrimaryCTAButton } from "./PrimaryCTAButton";

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
  return (
    <header className="fixed inset-x-0 top-5 z-50">
      <div className="mx-auto max-w-[90vw] px-4 py-3">
        <div className="flex items-center justify-between rounded-tl-lg rounded-bl-3xl rounded-tr-3xl rounded-br-lg bg-white pl-4 py-3 shadow-sm">
          <Link href="#home" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Postura by Physio logo"
              width={150}
              height={5}
              priority
              className="h-14 w-auto object-contain"
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

          <PrimaryCTAButton
            href="#book-session"
            label="Book Session"
            size="md"
            className="pr-8"
          />

        </div>
      </div>
    </header>
  );
}

