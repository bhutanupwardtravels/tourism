"use client";

import Image from "next/image";
import type { Founder as FounderType } from "../schema";
import { Reveal } from "@/components/ui/reveal";

interface FounderProps {
  founder: FounderType;
}

export function Founder({ founder }: FounderProps) {
  const titleWords = founder.title.split(" ");
  const metaLine = [founder.role, founder.nationality, founder.experience && `${founder.experience} experience`]
    .filter(Boolean)
    .join(" · ");

  // Nothing meaningful to show without at least a name and bio.
  if (!founder.name && !founder.bio) return null;

  return (
    <section className="py-40 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          {/* Portrait */}
          <Reveal y={0} scale={0.9} duration={1}
            className="lg:col-span-5 relative group">
            <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
              {founder.image ? (
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
                  <span className="text-7xl font-serif italic text-amber-500/80">
                    {founder.name
                      .split(" ")
                      .map((word) => word[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 border border-black/5" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t border-r border-black/10 group-hover:border-amber-600/30 transition-colors" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b border-l border-black/10 group-hover:border-amber-600/30 transition-colors" />
          </Reveal>

          {/* Narrative Content */}
          <Reveal y={0} x={30} duration={1}
            className="lg:col-span-7">
            <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] mb-6 block">
              // {founder.subtitle || "founder"}
            </span>

            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-8 uppercase text-black">
              {titleWords[0]}{" "}
              <span className="italic font-serif normal-case text-amber-600">
                {titleWords.slice(1).join(" ")}
              </span>
            </h2>

            {founder.name && (
              <div className="mb-8 space-y-1">
                <p className="text-2xl font-light text-black">{founder.name}</p>
                {metaLine && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-600">
                    {metaLine}
                  </p>
                )}
              </div>
            )}

            {founder.bio && (
              <div className="relative pl-12 border-l border-black/10">
                <p className="text-xl text-gray-500 leading-relaxed font-light italic whitespace-pre-line">
                  "{founder.bio}"
                </p>
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-600/30" />
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
