"use client";

import { motion } from "framer-motion";

interface DestinationHeroProps {
  name: string;
  image: string;
  region: string;
}

export function DestinationHero({ name, image, region }: DestinationHeroProps) {
  return (
    <div className="h-screen relative overflow-hidden bg-white">
      {/* Background Image with Color */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
        <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
      </motion.div>

      {/* Animated Light Leak */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
        {/* Background Large Text (Color Accent) */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.07, x: 0 }}
          transition={{ duration: 2 }}
          className="absolute font-bold text-[30vw] uppercase leading-none tracking-tighter select-none pointer-events-none text-amber-500 whitespace-nowrap"
        >
          {name}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative z-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-amber-400 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          >
            // exploring: {region}
          </motion.span>
          <h1 className="text-6xl md:text-9xl font-light text-white tracking-tighter mb-12 uppercase mix-blend-overlay opacity-90 drop-shadow-2xl">
            {name.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-100 block md:inline" : "text-white"}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <div className="flex items-center justify-center gap-8 mt-12">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="h-px bg-linear-to-r from-transparent to-amber-500"
            />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-400">Mission Parameters Verified</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="h-px bg-linear-to-l from-transparent to-amber-500"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-12 flex flex-col items-start gap-4"
      >
        <div className="font-mono text-[9px] tracking-[0.3em] text-amber-700/60 uppercase space-y-2">
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-600 rounded-full animate-pulse" />
            lat: 27.5142° n
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-600 rounded-full animate-pulse delay-75" />
            long: 90.4336° e
          </p>
        </div>
        <div className="w-px h-16 bg-linear-to-b from-amber-600/50 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-12 right-12 flex items-center gap-6"
      >
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-500">
          Plan Your <span className="text-amber-600">Journey</span>
        </span>
        <div className="w-14 h-14 rounded-full border border-amber-600/20 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-amber-600/10 animate-ping" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-amber-600 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"
          />
        </div>
      </motion.div>
    </div>
  );
}
