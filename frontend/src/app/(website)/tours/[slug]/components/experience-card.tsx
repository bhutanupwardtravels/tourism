import { Experience } from "../../schema";
import { ArrowUpRight } from "lucide-react";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-neutral-100 border border-black/5 mb-8">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover transition-all duration-1000 saturate-[0.7] brightness-[1.05] group-hover:saturate-[1.2] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-colors duration-700" />
        <div className="absolute inset-0 bg-linear-to-t from-white via-white/5 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />

        {experience.category && (
          <div className="absolute top-6 left-6">
            <span className="font-mono text-[9px] text-amber-600 uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md px-3 py-1 border border-black/5">
              {experience.category}
            </span>
          </div>
        )}

        <div className="absolute bottom-6 left-6 flex items-center gap-4">
          <span className="h-px w-8 bg-amber-500/50" />
          <span className="font-mono text-[9px] text-white uppercase tracking-widest drop-shadow-md">
            Visual Record // BHU-EXP
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <h4 className="text-3xl font-light tracking-tighter text-black group-hover:italic transition-all duration-500 uppercase">
          {experience.title}
        </h4>
        <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-amber-500 transition-colors shrink-0 ml-4">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>

      <p className="mt-4 text-gray-500 font-light leading-relaxed line-clamp-2 italic text-sm">
        "{experience.description}"
      </p>
    </div>
  );
}
