"use client";

import { Reveal } from "@/components/ui/reveal";

/**
 * One short band, not a manifesto. The philosophy is the reason people choose
 * us — but it reads after they've seen the trips, not as a toll on the way to them.
 */
export function CompanyIntro() {
  return (
    <section className="py-16 md:py-20 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <Reveal y={20} duration={0.8} className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-amber-500/60 text-xs uppercase tracking-[0.4em] mb-6 block">
            // the bhutanese essence
          </span>

          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white uppercase mb-8 leading-tight">
            Crafting <span className="italic font-serif normal-case text-amber-500">Transformative</span> Journeys
          </h2>

          <p className="text-base font-light text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Every journey honours Bhutan's heritage and its philosophy of Gross National Happiness —
            and contributes directly to the Sustainable Development Fee that funds free healthcare,
            education and conservation for the Kingdom.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
