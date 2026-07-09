"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
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

export function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
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
                  <a
                    href="tel:+1234567890"
                    className="block text-2xl hover:underline"
                  >
                    +975 123 456 789
                  </a>
                  <a
                    href="mailto:travel@bhutan.com"
                    className="block text-xl hover:underline"
                  >
                    travel@bhutan.com
                  </a>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-400">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Facebook
                    </a>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Twitter
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
