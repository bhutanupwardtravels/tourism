"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="/videos/landing_video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
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
          <h1 className="text-6xl md:text-9xl font-light text-white tracking-tighter mb-12 uppercase mix-blend-overlay opacity-90">
            Bhutan
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <Link
              href="/destinations"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
            >
              Explore Regions
            </Link>
          </div>
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
