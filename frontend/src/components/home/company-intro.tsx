"use client";

import { motion } from "framer-motion";

export function CompanyIntro() {
  return (
    <section className="py-40 md:py-60 bg-neutral-950 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="flex flex-col items-center gap-6 mb-16">
            <span className="font-mono text-amber-500/60 text-[10px] uppercase tracking-[0.6em] block">
              // The Bhutanese Essence
            </span>
            <div className="h-20 w-px bg-linear-to-b from-amber-500/0 via-amber-500/40 to-amber-500/0" />
          </div>

          <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white uppercase mb-16 leading-tight">
            Crafting <span className="italic font-serif normal-case text-amber-500">Transformative</span> Journeys
          </h2>

          <p className="text-xl md:text-2xl font-light text-neutral-400 leading-relaxed max-w-4xl mx-auto italic font-serif">
            "We are dedicated to honoring Bhutan's rich cultural heritage, pristine environment, and the
            philosophy of Gross National Happiness. Each experience is thoughtfully curated to
            create meaningful connections between travelers and the Kingdom of the Thunder Dragon."
          </p>

          <div className="mt-20 flex justify-center gap-12 opacity-30 select-none pointer-events-none">
            <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">Cultural Preservation</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">Environmental Integrity</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">Soulful Exploration</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
