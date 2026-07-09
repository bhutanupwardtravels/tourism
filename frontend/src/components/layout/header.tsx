"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { OverlayMenu } from "@/components/ui/overlay-menu";
import { useScroll, useMotionValueEvent } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  const isHome = pathname === "/";
  // Pages with white backgrounds requiring dark text when not scrolled
  const isDarkText =
    (pathname === "/destinations" ||
      pathname === "/experiences" ||
      pathname === "/tours") &&
    !isScrolled;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-black/80 backdrop-blur-md py-4"
            : "bg-transparent py-6"
        )}
      >
        <div
          className={cn(
            "container mx-auto px-6 flex items-center justify-between transition-colors duration-500",
            isDarkText ? "text-black" : "text-white"
          )}
        >
          {/* Logo */}
          <Link href="/" className="z-50 relative group">
            <span className="text-2xl font-bold tracking-widest uppercase">
              Bhutan
            </span>
            <span
              className={cn(
                "block text-[10px] tracking-[0.3em] transition-colors",
                isDarkText
                  ? "text-gray-600 group-hover:text-black"
                  : "text-gray-300 group-hover:text-white"
              )}
            >
              Kingdom of Happiness
            </span>
          </Link>

          {/* Desktop Nav (Minimal) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/destinations"
              className={cn(
                "text-sm font-medium transition-colors uppercase tracking-wider",
                isDarkText ? "hover:text-gray-600" : "hover:text-gray-300"
              )}
            >
              Destinations
            </Link>
            <Link
              href="/experiences"
              className={cn(
                "text-sm font-medium transition-colors uppercase tracking-wider",
                isDarkText ? "hover:text-gray-600" : "hover:text-gray-300"
              )}
            >
              Experiences
            </Link>
            <Link
              href="/tours"
              className={cn(
                "text-sm font-medium transition-colors uppercase tracking-wider",
                isDarkText ? "hover:text-gray-600" : "hover:text-gray-300"
              )}
            >
              Tours
            </Link>
            {/* <Link
              href="/about-us"
              className={cn(
                "text-sm font-medium transition-colors uppercase tracking-wider",
                isDarkText ? "hover:text-gray-600" : "hover:text-gray-300"
              )}
            >
              About Us
            </Link> */}
            {/* <Link
              href="/plan-my-trip"
              className={cn(
                "text-sm font-medium transition-colors uppercase tracking-wider",
                isDarkText ? "hover:text-gray-600" : "hover:text-gray-300"
              )}
            >
              Plan My Trip
            </Link> */}
            <Link
              href="/plan-my-trip"
              className={cn(
                "group/btn relative px-6 py-2 text-xs font-medium uppercase tracking-wider overflow-hidden transition-all duration-300",
                isDarkText
                  ? "bg-black text-white"
                  : "bg-white text-black"
              )}
            >
              <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Plan My Trip</span>
              <div className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 bg-amber-600 transition-transform duration-500" />
            </Link>
            {/* <Link
              href="/enquire"
              className={cn(
                "px-6 py-2 text-sm font-medium transition-colors uppercase tracking-wider",
                isDarkText
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-gray-200"
              )}
            >
              Enquire
            </Link> */}
          </nav>

          {/* Mobile/Overlay Toggle */}
          <div className="flex items-center gap-4">
            {/* <button
              className={cn(
                "p-2 rounded-full transition-colors",
                isDarkText ? "hover:bg-black/10" : "hover:bg-white/10"
              )}
            >
              <Search className="w-5 h-5" />
            </button> */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "p-2 rounded-full transition-colors flex items-center gap-2",
                isDarkText ? "hover:bg-black/10" : "hover:bg-white/10"
              )}
            >
              <Menu className="w-6 h-6" />
              <span className="hidden md:inline text-sm font-medium uppercase tracking-wider">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
