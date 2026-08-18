"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { OverlayMenu } from "@/components/ui/overlay-menu";
import { useScroll, useMotionValueEvent } from "framer-motion";
import type { ContactContent } from "@/lib/data/contact";

interface HeaderProps {
  contact?: ContactContent | null;
}

// Only the four product categories people browse by sit in the bar. The
// hamburger holds everything else — Travel Guide, About, contact details — so
// it carries a payload the visible nav does not already show. That is the
// difference that makes a hamburger worth opening: when it merely repeats the
// nav beside it, nobody does.
const PRIMARY_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/tours", label: "Tours" },
  { href: "/hotels", label: "Hotels" },
];

export function Header({ contact }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Pages with white backgrounds requiring dark text when not scrolled
  const lightBgPages = ["/destinations", "/experiences", "/tours", "/hotels", "/terms", "/privacy", "/bhutan-travel-guide"];
  const isDarkText = lightBgPages.includes(pathname) && !isScrolled;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // WhatsApp is the channel most enquiries actually arrive on; fall back to the
  // phone number so the header never renders without a human to call.
  const whatsappDigits = contact?.whatsapp?.replace(/[^0-9]/g, "");
  const directContact = whatsappDigits
    ? { href: `https://wa.me/${whatsappDigits}`, label: contact!.whatsapp, external: true }
    : contact?.phone
      ? { href: `tel:${contact.phone.replace(/\s+/g, "")}`, label: contact.phone, external: false }
      : null;

  const menuButton = (className?: string) => (
    <button
      onClick={() => setIsMenuOpen(true)}
      aria-label="Open menu"
      aria-expanded={isMenuOpen}
      aria-controls="overlay-menu"
      className={cn(
        "p-2 -m-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600",
        isDarkText ? "hover:bg-black/10" : "hover:bg-white/10",
        className
      )}
    >
      <Menu className="w-5 h-5" strokeWidth={1.75} />
    </button>
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-black/80 backdrop-blur-md py-3"
            : "bg-transparent py-5"
        )}
      >
        <div
          className={cn(
            "container mx-auto px-6 flex items-center gap-4 transition-colors duration-500",
            isDarkText ? "text-black" : "text-white"
          )}
        >
          {/* Logo */}
          <Link href="/" className="z-50 relative group flex shrink-0 items-center gap-2.5">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
                !isDarkText && "bg-white"
              )}
            >
              <Image
                src="/images/logo.png"
                alt="Bhutan Upward Travels logo"
                width={32}
                height={32}
                priority
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[13px] font-bold uppercase tracking-[0.18em] whitespace-nowrap">
                Bhutan Upward
              </span>
              <span
                className={cn(
                  "mt-1 block text-[8px] uppercase tracking-[0.3em] transition-colors",
                  isDarkText
                    ? "text-gray-600 group-hover:text-black"
                    : "text-gray-300 group-hover:text-white"
                )}
              >
                Travels
              </span>
            </span>
          </Link>

          {/* Centred primary nav + menu */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-7">
            {PRIMARY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "text-xs font-medium uppercase tracking-[0.18em] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600",
                  isDarkText ? "hover:text-gray-600" : "hover:text-gray-300",
                  pathname === item.href && "text-amber-600"
                )}
              >
                {item.label}
              </Link>
            ))}
            {menuButton()}
          </nav>

          {/* Contact + primary action */}
          <div className="ml-auto flex shrink-0 items-center gap-5 lg:ml-0">
            {directContact && (
              <a
                href={directContact.href}
                {...(directContact.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={cn(
                  "hidden lg:flex items-center gap-2 text-xs font-medium tracking-wide whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600",
                  isDarkText ? "text-gray-700 hover:text-black" : "text-gray-200 hover:text-white"
                )}
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                {directContact.label}
              </a>
            )}

            <Link
              href="/plan-my-trip"
              className={cn(
                "group/btn relative hidden sm:inline-block shrink-0 whitespace-nowrap px-5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] overflow-hidden transition-all duration-300",
                isDarkText
                  ? "bg-black text-white"
                  : "bg-white text-black"
              )}
            >
              <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Plan my trip</span>
              <div className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 bg-amber-600 transition-transform duration-500" />
            </Link>

            {/* Below lg the whole nav lives behind the menu */}
            {menuButton("lg:hidden")}
          </div>
        </div>
      </header>

      <OverlayMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        contact={contact}
      />
    </>
  );
}
