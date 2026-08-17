"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  /** Real, checkable credentials — already stored in the About content. */
  licenseNumber?: string;
  foundingYear?: string;
  reviewCount?: number;
}

export function Hero({ licenseNumber, foundingYear, reviewCount }: HeroProps) {
  // A looping background video is decoration, not content: when the OS asks for
  // reduced motion, hold the poster frame instead.
  const prefersReducedMotion = useReducedMotion();

  const trustPoints = [
    licenseNumber && `Licence ${licenseNumber}`,
    foundingYear && `Operating since ${foundingYear}`,
    reviewCount && reviewCount > 0 && `${reviewCount} traveller review${reviewCount === 1 ? "" : "s"}`,
    "Sustainable Development Fee included",
  ].filter(Boolean) as string[];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 z-10" />
        {prefersReducedMotion ? (
          <img
            src="/images/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            preload="metadata"
            poster="/images/hero-poster.jpg"
            className="w-full h-full object-cover"
          >
            <source
              src="/videos/landing_video.mp4"
              type="video/mp4"
            />
          </video>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="font-mono text-xs md:text-sm font-medium tracking-[0.5em] uppercase text-white/90 mb-8 block drop-shadow-md">
                // welcome to the kingdom
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h1>
            <span className="block text-6xl md:text-9xl font-light text-white tracking-tighter mb-4 uppercase drop-shadow-2xl">
              Bhutan
            </span>
            <span className="block font-light text-base md:text-xl tracking-wide text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md">
              Private guided journeys built with licensed Bhutanese specialists.
              Sustainable Development Fee included, no fixed departures.
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
            <Link
              href="/plan-my-trip"
              className="bg-white text-black px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all duration-500"
            >
              Plan my trip
            </Link>
            <Link
              href="/tours"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
            >
              Browse itineraries
            </Link>
          </div>

          {trustPoints.length > 0 && (
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-white/70">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 drop-shadow-md">
                  <span className="h-1 w-1 rounded-full bg-amber-500" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 left-0 right-0 z-20 flex justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll to Discover</span>
          <div className="w-px h-12 bg-linear-to-b from-white/0 via-white/40 to-white/0" />
        </div>
      </motion.div>
    </section>
  );
}
