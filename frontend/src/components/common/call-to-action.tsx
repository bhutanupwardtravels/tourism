"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-40 bg-white relative overflow-hidden ">
      {/* Background Decorative Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 left-0 w-full h-[120%] text-neutral-100 fill-current opacity-60"
          preserveAspectRatio="none"
        >
          <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-10 left-0 w-full h-full text-neutral-50 fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,165.3C960,160,1056,96,1152,101.3C1248,107,1344,181,1392,218.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Abstract Organic Topography - Refined & More Visible with Seamless Fading */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#faf9f6] via-transparent to-[#faf9f6] z-10" />
        <svg width="100%" height="100%" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g fill="none" stroke="black" strokeWidth="1">
            {/* Dense Cluster Right */}
            <path d="M1300 0 C 1350 150, 1550 200, 1500 350 S 1300 500, 1400 650 S 1550 850, 1500 1000" />
            <path d="M1250 0 C 1300 160, 1500 210, 1450 360 S 1250 510, 1350 660 S 1500 860, 1450 1010" />
            <path d="M1200 0 C 1250 170, 1450 220, 1400 370 S 1200 520, 1300 670 S 1450 870, 1400 1020" />
            <path d="M1150 0 C 1200 180, 1400 230, 1350 380 S 1150 530, 1250 680 S 1400 880, 1350 1030" />

            {/* Dense Cluster Left */}
            <path d="M300 0 C 250 150, 50 200, 100 350 S 300 500, 200 650 S 50 850, 100 1000" />
            <path d="M250 0 C 200 160, 0 210, 50 360 S 250 510, 150 660 S 0 860, 50 1010" />
            <path d="M200 0 C 150 170, -50 220, 0 370 S 200 520, 100 670 S -50 870, 0 1020" />
            <path d="M150 0 C 100 180, -100 230, -50 380 S 150 530, 50 680 S -100 880, -50 1030" />

            {/* Central Floating Topo Islands */}
            <path d="M720 150 C 820 100, 950 200, 900 300 S 650 350, 720 150 Z" />
            <path d="M725 160 C 810 115, 930 210, 885 290 S 665 330, 725 160 Z" />

            <path d="M480 600 C 580 550, 750 650, 700 750 S 400 850, 480 600 Z" />
            <path d="M485 610 C 570 565, 730 660, 685 740 S 415 830, 485 610 Z" />
          </g>
        </svg>
      </div>

      {/* Narrative ID Overlay */}
      <div className="absolute top-20 right-10 font-mono text-[10px] text-gray-200 uppercase tracking-[0.6em] writing-mode-vertical-rl rotate-180 select-none">
        PROTOCOL // REQ-2025
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] mb-4 block">
            // start your journey
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black">
            Start Your <span className="italic font-serif normal-case text-amber-600">Discovery</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed font-light italic">
            "Let us craft a bespoke itinerary that includes these regional highlights and
            many more hidden gems within the Kingdom."
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Link
              href="/enquire"
              className="group relative inline-flex items-center gap-8 bg-black px-12 py-6 text-white text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-amber-600 overflow-hidden"
            >
              <span className="relative z-10">Plan Your Custom Trip</span>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-amber-500 transition-transform duration-500" />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <span className="h-px w-20 bg-black/10" />
              <span className="font-mono text-[8px] text-gray-400 uppercase tracking-widest leading-none">
                Verified Partner <br /> Bhutan Tourism Board
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
