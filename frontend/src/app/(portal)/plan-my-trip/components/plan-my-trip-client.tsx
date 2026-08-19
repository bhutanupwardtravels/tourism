"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, MessageCircle, Clock, User } from "lucide-react";
import { PackageSelection } from "./package-selection";
import { CustomItineraryBuilder } from "./custom-itinerary-builder";
import { TourRequestForm } from "./tour-request-form";
import { PlanMyTripHero, type PlanningStep } from "./plan-my-trip-hero";
import { readDraft } from "../draft";
import { usePortalChrome } from "../../portal-chrome";
import { Tour } from "@/app/(website)/tours/schema";
import { Destination } from "@/app/(website)/destinations/schema";
import { Experience } from "@/app/(website)/experiences/schema";
import { Hotel } from "../../../admin/hotels/schema";
import { Cost } from "../../../admin/settings/schema";

/**
 * Shared shell for the three post-choice panels.
 *
 * Every branch of the swap below has to be a *keyed motion element*. With
 * mode="wait", AnimatePresence holds the incoming child until the outgoing one
 * reports its exit finished — and a plain, unkeyed <div> never reports one. The
 * mode grid then stays mounted at ~0 opacity and the next step never appears,
 * which dead-ends the primary CTA on a visibly blank page.
 */
const PANEL_SHELL = "bg-white text-black shadow-2xl p-6 md:p-16 my-8";
const PANEL_TRANSITION: Transition = { duration: 0.3, ease: "easeOut" };
const PANEL_MOTION = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: PANEL_TRANSITION,
};

/**
 * The three ways in. Each one carries an effort cue and an audience cue,
 * because the cost of this screen is not reading three sentences — it is
 * having to model three unknown processes before committing to any of them.
 * One is marked recommended so there is a default to fall back on; without
 * one, a meaningful share of people resolve three equal options by picking
 * none, at the point in the funnel where that is most expensive.
 */
const MODES: {
    id: string;
    icon: typeof Sparkles;
    titleTop: string;
    titleAccent: string;
    description: string;
    effort: string;
    audience: string;
    cta: string;
    glyphRotation: string;
    recommended?: boolean;
    step?: PlanningStep;
    href?: string;
}[] = [
    {
        id: "package",
        icon: Sparkles,
        titleTop: "Choose a",
        titleAccent: "ready-made trip",
        description:
            "Complete itineraries from 5 to 15 days, each with a price and a day-by-day plan. Pick one and we'll tailor the details to you.",
        effort: "About 2 minutes",
        audience: "If you know roughly what you want",
        cta: "See the itineraries",
        glyphRotation: "rotate-12",
        recommended: true,
        step: "package_list",
    },
    {
        id: "custom",
        icon: Heart,
        titleTop: "Build your own",
        titleAccent: "day by day",
        description:
            "Choose where you go, what you do and where you stay. The estimated price updates as you build.",
        effort: "About 10 minutes",
        audience: "If you want full control",
        cta: "Start building",
        glyphRotation: "-rotate-12",
        step: "custom_builder",
    },
    {
        id: "talk",
        icon: MessageCircle,
        titleTop: "Just talk",
        titleAccent: "to someone",
        description:
            "Not sure where to start? Send us a few details and a specialist will come back with suggestions.",
        effort: "About 30 seconds",
        audience: "If you're not sure yet",
        cta: "Talk to a specialist",
        glyphRotation: "rotate-6",
        href: "/enquire",
    },
];

interface PlanMyTripPageProps {
    packages: Tour[];
    destinations: Destination[];
    allDestinations: Destination[];
    experiences: Experience[];
    hotels: Hotel[];
    costs: Cost[];
}

export default function PlanMyTripClient({
    packages = [],
    destinations = [],
    allDestinations = [],
    experiences = [],
    hotels = [],
    costs = []
}: PlanMyTripPageProps) {
    const searchParams = useSearchParams();

    // A ?package= link should land straight on that package. Both the query and
    // the package list are available on the first render, so this is seeded up
    // front rather than corrected afterwards in an effect.
    const packagedTour =
        packages.find(p => p.slug === searchParams.get("package")) ?? null;

    const [step, setStep] = useState<PlanningStep>(
        packagedTour ? "package_list" : "mode_selection"
    );
    const [selectedTour, setSelectedTour] = useState<Tour | null>(packagedTour);

    // A saved itinerary is worthless if a refresh drops the traveller back on
    // the mode picker with no sign of it, so resume into the builder directly.
    // The draft lives in localStorage, which does not exist during the server
    // render, so this one genuinely has to wait until after hydration.
    useEffect(() => {
        if (searchParams.get("package")) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
        if (readDraft()) setStep("custom_builder");
    }, [searchParams]);

    // The marketing header only gets out of the way once the traveller is
    // actually building day by day; the choice and enquiry screens keep it,
    // along with the licence and contact details in the portal footer.
    usePortalChrome(step === "custom_builder" ? "workspace" : "site");

    const handleTourSelect = (tour: Tour) => {
        setSelectedTour(tour);
        setStep("inquiry_form");
    };

    // Each step replaces the whole panel, and the replacement is usually much
    // shorter than what it replaced (the package grid is ~3600px, the request
    // form ~2200px). The browser keeps the old scroll offset, so without this
    // the traveller's first view of the request form is its bottom edge — a
    // discount box and a submit button, with every field they have to fill in
    // off-screen above. Skipped on first paint so a deep link or a resumed
    // draft does not yank a page that is already at the top.
    const panelRef = useRef<HTMLElement>(null);
    const hasRendered = useRef(false);

    useEffect(() => {
        if (!hasRendered.current) {
            hasRendered.current = true;
            return;
        }
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        panelRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
        });
    }, [step]);

    return (
        <div className="pb-20">
            <PlanMyTripHero step={step} />

            {/* Mode Selection / Interface Area */}
            <section ref={panelRef} className="relative scroll-mt-24 px-4 sm:px-6 lg:scroll-mt-28">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === "mode_selection" ? (
                            <motion.div
                                key="mode-selection"
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="grid md:grid-cols-3 gap-px bg-black/5 p-px shadow-2xl"
                            >
                                {MODES.map((mode) => {
                                    const Icon = mode.icon;
                                    const body = (
                                        <>
                                            {/* The recommended path is the only one that announces
                                                itself, so the eye lands somewhere by default instead
                                                of pricing up three unknown processes first. */}
                                            {mode.recommended && (
                                                <span className="absolute top-0 left-0 bg-amber-600 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white">
                                                    Most travellers start here
                                                </span>
                                            )}

                                            <div className="space-y-8 relative z-10">
                                                <div
                                                    className={`w-12 h-12 border border-black/10 flex items-center justify-center transition-all duration-500 ${mode.recommended
                                                        ? "bg-amber-600 text-white border-amber-600"
                                                        : "group-hover:bg-amber-600 group-hover:text-white"
                                                        }`}
                                                >
                                                    <Icon
                                                        className={`w-5 h-5 transition-all duration-500 ${mode.recommended ? "text-white" : "text-black group-hover:text-white"
                                                            }`}
                                                    />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl md:text-4xl font-light tracking-tighter uppercase mb-6 leading-none text-black">
                                                        {mode.titleTop} <br />
                                                        <span className="italic font-serif normal-case text-amber-600">
                                                            {mode.titleAccent}
                                                        </span>
                                                    </h2>
                                                    <p className="text-gray-500 text-base leading-relaxed font-light max-w-sm">
                                                        {mode.description}
                                                    </p>
                                                </div>

                                                {/* Effort and audience, so the choice is "that one is
                                                    me" rather than "which of these is least risky". */}
                                                <dl className="space-y-2 border-t border-black/10 pt-5 text-sm">
                                                    <div className="flex items-baseline gap-2">
                                                        <dt className="sr-only">Time needed</dt>
                                                        <Clock className="w-3.5 h-3.5 shrink-0 translate-y-0.5 text-amber-600" aria-hidden="true" />
                                                        <dd className="font-medium text-black">{mode.effort}</dd>
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <dt className="sr-only">Best for</dt>
                                                        <User className="w-3.5 h-3.5 shrink-0 translate-y-0.5 text-amber-600" aria-hidden="true" />
                                                        <dd className="text-gray-500 font-light">{mode.audience}</dd>
                                                    </div>
                                                </dl>
                                            </div>

                                            <div
                                                className={`mt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${mode.recommended
                                                    ? "text-amber-600"
                                                    : "text-gray-400 group-hover:text-amber-600"
                                                    }`}
                                            >
                                                {mode.cta}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-500" />
                                            </div>

                                            {/* Abstract Overlay */}
                                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                                <Icon className={`w-40 h-40 ${mode.glyphRotation} text-black group-hover:text-amber-600 transition-all`} />
                                            </div>
                                        </>
                                    );

                                    const shell = `group relative overflow-hidden transition-all duration-700 p-10 md:p-12 pt-14 md:pt-16 text-left flex flex-col justify-between aspect-4/5 md:aspect-auto ${mode.recommended
                                        ? "bg-white ring-2 ring-inset ring-amber-600 hover:bg-amber-50/40"
                                        : "bg-white hover:bg-neutral-50"
                                        }`;

                                    return mode.href ? (
                                        <Link key={mode.id} href={mode.href} className={shell}>
                                            {body}
                                        </Link>
                                    ) : (
                                        <motion.button
                                            key={mode.id}
                                            onClick={() => setStep(mode.step!)}
                                            className={shell}
                                        >
                                            {body}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        ) : step === "package_list" ? (
                            <motion.div key="package-list" {...PANEL_MOTION} className={PANEL_SHELL}>
                                <PackageSelection
                                    packages={packages}
                                    selectedPackage={selectedTour}
                                    onBack={() => setStep("mode_selection")}
                                    onSelect={handleTourSelect}
                                />
                            </motion.div>
                        ) : step === "custom_builder" ? (
                            <motion.div key="custom-builder" {...PANEL_MOTION} className={PANEL_SHELL}>
                                <CustomItineraryBuilder
                                    experiences={experiences}
                                    destinations={destinations}
                                    allDestinations={allDestinations}
                                    hotels={hotels}
                                    costs={costs}
                                    onBack={() => setStep("mode_selection")}
                                />
                            </motion.div>
                        ) : step === "inquiry_form" ? (
                            <motion.div key="inquiry-form" {...PANEL_MOTION} className={PANEL_SHELL}>
                                <TourRequestForm
                                    selectedTour={selectedTour}
                                    onBack={() => setStep("package_list")}
                                />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
