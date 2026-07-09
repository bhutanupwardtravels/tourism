"use client";

import { motion } from "framer-motion";
import { Hero } from "../schema";

interface AboutHeroProps {
  hero: Hero;
}

export function AboutHero({ hero }: AboutHeroProps) {
  const titleWords = hero.title.split(' ');

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Background Image with Cinematic Overlays */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src={hero.backgroundImage}
          alt="Bhutan landscape"
          className="w-full h-full object-cover"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-linear-to-tr from-amber-500/10 via-transparent to-blue-500/10 mix-blend-overlay" />
      </motion.div>

      {/* Animated Light Leak */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen z-10"
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-6 text-center">
        {/* Background Large Text (Color Accent) */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.05, x: 0 }}
          transition={{ duration: 2 }}
          className="absolute font-bold text-[25vw] uppercase leading-none tracking-tighter select-none pointer-events-none text-amber-500 whitespace-nowrap z-0"
        >
          {hero.title}
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono text-amber-400 text-xs uppercase tracking-[0.6em] mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              // {hero.subtitle}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-none mb-8 uppercase drop-shadow-2xl">
              {titleWords.map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500" : "text-white"}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="max-w-2xl text-lg md:text-xl text-gray-200 font-light leading-relaxed font-serif italic mx-auto">
              "{hero.description}"
            </p>
          </motion.div>

          {/* Mission Parameters Indicator */}
          <div className="flex items-center justify-center gap-8 mt-16">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="h-px bg-linear-to-r from-transparent to-amber-500"
            />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-gray-400">Identity Protocol Active</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="h-px bg-linear-to-l from-transparent to-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Side Tactical Metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-12 flex flex-col items-start gap-4 z-20"
      >
        <div className="font-mono text-[8px] tracking-[0.3em] text-amber-700/60 uppercase space-y-2">
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-600 rounded-full animate-pulse" />
            org: tourism kingdom
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-600 rounded-full animate-pulse delay-75" />
            status: verified
          </p>
        </div>
        <div className="w-px h-16 bg-linear-to-b from-amber-600/50 to-transparent" />
      </motion.div>

      {/* Bottom Right Action Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-12 right-12 flex items-center gap-6 z-20"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-gray-500">
          Scroll to <span className="text-amber-600">Explore</span>
        </span>
        <div className="w-12 h-12 rounded-full border border-amber-600/20 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-amber-600/10 animate-ping" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-amber-600 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"
          />
        </div>
      </motion.div>
    </section>
  );
}

