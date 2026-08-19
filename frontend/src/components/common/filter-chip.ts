import { cn } from "@/lib/utils";

/**
 * The shared look for a toggle-style filter control.
 *
 * Lives here rather than in either index page because /tours and /experiences
 * had drifted into two unrelated idioms for the same job — one bordered chip
 * with a solid active state, one row of untreated mono labels whose selected
 * item (amber on a 5% grey wash) sat at roughly 2.85:1 contrast, below the
 * unselected items around it. Filters read as controls only if they are
 * consistently shaped, so the shape is defined once.
 *
 * Callers still own layout and any label composition; this is only the chip.
 */
export const filterChip = (active: boolean, className?: string) =>
    cn(
        "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] border transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600",
        active
            ? "bg-black text-white border-black"
            : "bg-white text-gray-600 border-black/15 hover:border-black hover:text-black",
        className
    );
