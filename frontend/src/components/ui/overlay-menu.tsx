"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const socialLinks = [
    { href: contact?.socials.instagram, label: "Instagram" },
    { href: contact?.socials.facebook, label: "Facebook" },
    { href: contact?.socials.twitter, label: "Twitter" },
    { href: contact?.socials.youtube, label: "YouTube" },
  ].filter((social) => !!social.href);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 bg-black text-white overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-8 h-full flex flex-col">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row items-start justify-center lg:justify-between pt-10 lg:pt-20 gap-12">
              {/* Main Navigation */}
              <motion.nav
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6"
              >
                <motion.div variants={itemVariants} className="mb-10 lg:hidden">
                  <Link
                    href="/plan-my-trip"
                    onClick={onClose}
                    className="group/cta relative inline-flex items-center gap-6 overflow-hidden bg-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black transition-colors duration-300"
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
                    className="text-4xl lg:text-6xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Destinations
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/experiences"
                    className="text-4xl lg:text-6xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Experiences
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/tours"
                    className="text-4xl lg:text-6xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Tours
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/about-us"
                    className="text-4xl lg:text-6xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    About Us
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/bhutan-travel-guide"
                    className="text-4xl lg:text-6xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Travel Guide
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/enquire"
                    className="text-4xl lg:text-6xl font-light hover:text-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Enquire
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
