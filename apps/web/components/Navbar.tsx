import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
          <div className="group relative pr-8">
          <Link
            href="#book-session"
            className="inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-4 text-sm  text-white shadow-sm hover:opacity-95 transition"
          >
            Book Session
            
          </Link>
          <span className="absolute right-5 top-3 grid h-7 w-7 place-items-center rounded-full bg-[#FEF9E0]">
              <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}

