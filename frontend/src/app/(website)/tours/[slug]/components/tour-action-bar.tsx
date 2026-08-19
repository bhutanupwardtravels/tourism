"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Published on <html> so the other two bottom-anchored elements — the chat
 * bubble and the promo banner, neither of which knows this bar exists — can
 * lift themselves clear of it. Without this all three stack in the same corner
 * on a phone, and the promo banner (nearly full width at this breakpoint, and
 * at a higher z-index) lands squarely on the only CTA a mobile tour page has.
 */
const BAR_HEIGHT_VAR = "--mobile-action-bar-h";

interface TourActionBarProps {
    slug: string;
    title: string;
    duration?: string;
    price?: number;
}

/**
 * Mobile counterpart to the sticky booking card. Below `lg` the sidebar stacks
 * to the bottom of the page, which left the entire itinerary with no way to act
 * on it. Appears once the hero is out of the way so it never covers the intro.
 */
export function TourActionBar({ slug, title, duration, price }: TourActionBarProps) {
    const [visible, setVisible] = useState(false);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // The bar is display:none above `lg`, where offsetHeight is 0 — which is
    // exactly right, since the desktop sidebar owns the CTA there and nothing
    // needs lifting. Measured rather than hard-coded because the title wraps.
    useEffect(() => {
        const root = document.documentElement;
        const publish = () => {
            const height = visible ? (barRef.current?.offsetHeight ?? 0) : 0;
            root.style.setProperty(BAR_HEIGHT_VAR, `${height}px`);
        };
        publish();
        window.addEventListener("resize", publish);
        return () => {
            window.removeEventListener("resize", publish);
            root.style.removeProperty(BAR_HEIGHT_VAR);
        };
    }, [visible]);

    const formattedPrice =
        price === undefined
            ? null
            : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
              }).format(price);

    return (
        <div
            ref={barRef}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/95 backdrop-blur-md transition-transform duration-300 lg:hidden",
                visible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white">{title}</p>
                    <p className="text-[11px] text-white/60">
                        {duration}
                        {formattedPrice && ` · from ${formattedPrice} pp · SDF included`}
                    </p>
                </div>
                <Link
                    href={`/plan-my-trip?package=${slug}`}
                    className="flex shrink-0 items-center gap-2 bg-amber-600 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    Plan my trip
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
