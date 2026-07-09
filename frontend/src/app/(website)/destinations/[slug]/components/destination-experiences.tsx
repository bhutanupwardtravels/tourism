"use client";

import { Experience } from "../../schema";
import { ExperienceCard } from "@/components/common/experience-card";
import { useState } from "react";

interface DestinationExperiencesProps {
  experiences: Experience[];
  destinationName: string;
}

export function DestinationExperiences({
  experiences,
  destinationName,
}: DestinationExperiencesProps) {
  const [displayCount, setDisplayCount] = useState(6);

  if (experiences.length === 0) return null;

  const sortedExperiences = [...experiences].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const displayedExperiences = sortedExperiences.slice(0, displayCount);
  const hasMore = displayCount < sortedExperiences.length;

  return (
    <section className="py-40 bg-[#faf9f6] border-t border-black/5 text-black relative overflow-hidden">
      {/* Abstract Organic Topography - Full Background Texture with Seamless Fading */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#faf9f6] via-transparent to-[#faf9f6] z-10" />
        <svg width="100%" height="100%" viewBox="0 0 1440 1000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g fill="none" stroke="black" strokeWidth="1">
            {/* Top Right Dense Cluster */}
            <path d="M1200 0 C 1250 100, 1400 150, 1350 300 S 1100 450, 1200 600 S 1400 800, 1350 1000" />
            <path d="M1150 0 C 1200 110, 1350 160, 1300 310 S 1050 460, 1150 610 S 1350 810, 1300 1010" />
            <path d="M1100 0 C 1150 120, 1300 170, 1250 320 S 1000 470, 1100 620 S 1300 820, 1250 1020" />
            <path d="M1050 0 C 1100 130, 1250 180, 1200 330 S 950 480, 1050 630 S 1250 830, 1200 1030" />

            {/* Bottom Left Dense Cluster */}
            <path d="M400 1000 C 350 850, 100 800, 150 650 S 400 500, 300 350 S 100 200, 150 0" />
            <path d="M350 1010 C 300 860, 50 810, 100 660 S 350 510, 250 360 S 50 210, 100 10" />
            <path d="M300 1020 C 250 870, 0 820, 50 670 S 300 520, 200 370 S 0 220, 50 20" />
            <path d="M250 1030 C 200 880, -50 830, 0 680 S 250 530, 150 380 S -50 230, 0 30" />

            {/* Central Organic Islands */}
            <path d="M720 300 C 800 250, 950 350, 900 450 S 700 550, 720 300 Z" />
            <path d="M725 310 C 790 270, 930 360, 885 440 S 715 530, 725 310 Z" />
            <path d="M730 320 C 780 290, 910 370, 870 430 S 730 510, 730 320 Z" />

            <path d="M500 700 C 580 650, 730 750, 680 850 S 480 950, 500 700 Z" />
            <path d="M505 710 C 570 670, 710 760, 665 840 S 495 930, 505 710 Z" />
          </g>
        </svg>
      </div>

      {/* Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 pb-12">
          <div className="max-w-2xl">
            <span className="font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
              // local experiences
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight uppercase">
              Explore: <span className="italic font-serif normal-case text-amber-600">{destinationName}</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayedExperiences.map((exp, index) => (
            <ExperienceCard key={exp.slug} experience={exp} index={index} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-24">
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="backdrop-blur-md border border-black/10 text-black px-12 py-5 font-mono text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Load More Experiences
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
