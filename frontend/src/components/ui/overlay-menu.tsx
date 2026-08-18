"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import type { ContactContent } from "@/lib/data/contact";

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ContactContent | null;
}

const menuVariants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function OverlayMenu({ isOpen, onClose, contact }: OverlayMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Whatever had focus before the menu opened, so it can be handed back.
  const openerRef = useRef<HTMLElement | null>(null);

  // A full-screen panel that does not take focus with it is a keyboard trap in
  // reverse: Tab walks into the page underneath while the overlay still covers
  // the screen, so a keyboard or screen-reader user is operating links they
  // cannot see. Escape to dismiss, Tab cycling inside the panel, and focus
  // returned to the toggle on close are what make it behave like a dialog.
  useEffect(() => {
    if (!isOpen) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // Captured now: by the time cleanup runs the ref may already be detached.
    const panel = panelRef.current;

    // The page behind must not scroll while the overlay is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panel?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      // Only pull focus back if it is still inside the panel being unmounted;
      // if the user clicked a link, the new page owns focus now.
      if (!panel || panel.contains(document.activeElement)) {
        openerRef.current?.focus();
      }
    };
  }, [isOpen, onClose]);

  const socialLinks = [
    { href: contact?.socials.instagram, label: "Instagram" },
    { href: contact?.socials.facebook, label: "Facebook" },
    { href: contact?.socials.twitter, label: "Twitter" },
    { href: contact?.socials.youtube, label: "YouTube" },
    { href: contact?.socials.tiktok, label: "TikTok" },
    { href: contact?.socials.reddit, label: "Reddit" },
  ].filter((social) => !!social.href);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          id="overlay-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 bg-black text-white overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-8 h-full flex flex-col">
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                <X className="w-8 h-8" aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row items-start justify-center lg:justify-between pt-6 lg:pt-10 gap-12">
              {/* Main Navigation */}
              <motion.nav
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-4"
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <Link
                    href="/plan-my-trip"
                    onClick={onClose}
                    className="group/cta relative inline-flex items-center gap-6 overflow-hidden bg-white px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300"
                  >
                    <span className="relative z-10 text-sm font-normal flex items-center gap-6 group-hover/cta:text-white transition-colors duration-300">
                      Plan My Trip
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 translate-y-full group-hover/cta:translate-y-0 bg-amber-600 transition-transform duration-500" />
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/destinations"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Destinations
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/experiences"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Experiences
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/tours"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Tours
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/hotels"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Hotels
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/about-us"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    About Us
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/bhutan-travel-guide"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Travel Guide
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/enquire"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Talk to a specialist
                  </Link>
                </motion.div>
              </motion.nav>

              {/* Secondary Navigation / Contact */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-8 lg:max-w-md"
              >
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-400">
                    Contact Us
                  </h3>
                  <p className="text-lg">
                    Start planning your custom trip to Bhutan today.
                  </p>
                  {contact?.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="block text-2xl hover:underline"
                    >
                      {contact.phone}
                    </a>
                  )}
                  {contact?.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="block text-xl hover:underline"
                    >
                      {contact.email}
                    </a>
                  )}
                  {contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xl hover:underline"
                    >
                      WhatsApp: {contact.whatsapp}
                    </a>
                  )}
                </motion.div>

                {socialLinks.length > 0 && (
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-xl font-medium text-gray-400">
                      Follow Us
                    </h3>
                    <div className="flex gap-4">
                      {socialLinks.map(({ href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-300 transition-colors"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
