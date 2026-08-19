"use client";

export type PlanningStep = "mode_selection" | "package_list" | "custom_builder" | "inquiry_form";

/**
 * The band under the headline tracks the step the traveller is actually on.
 *
 * It used to be fixed at "three ways to start", which stayed on screen after
 * they had picked one — so the page simultaneously announced a choice already
 * made and a "step 1 of 2" in the panel below it. Two contradictory claims
 * about where you are is worse than neither.
 */
const INTRO: Record<PlanningStep, string> = {
    mode_selection:
        "Three ways to start: pick a ready-made itinerary, build your own day by day, or just tell us what you have in mind. Either way a specialist reviews it and comes back with a full price.",
    package_list:
        "Step 1 of 2 — choose the itinerary that fits. Every one can be tailored afterwards; nothing here is fixed.",
    custom_builder:
        "Step 1 of 2 — build the trip day by day. Your progress is saved as you go, and the estimate updates with it.",
    inquiry_form:
        "Step 2 of 2 — tell us who is travelling and when. A specialist replies within 24 business hours with a full price.",
};

// Rendered both inside PlanMyTripClient and as the Suspense fallback in
// page.tsx — it doesn't read searchParams, so it always server-renders
// even while PlanMyTripClient (which does) is deferred to the client.
// Deliberately compact: the headline and the three ways to start have to
// share the first viewport with the header, so this is a text band rather
// than a full-height hero. The background image comes from the portal layout.
export function PlanMyTripHero({ step = "mode_selection" }: { step?: PlanningStep }) {
    return (
        <section className="relative flex items-center pt-8 pb-10 md:pt-10 md:pb-12">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
                <div>
                    <span className="font-mono text-amber-500 text-xs font-bold tracking-[0.5em] uppercase block mb-4">
                        {"// plan your trip"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white uppercase leading-none">
                        Plan Your{" "}
                        <span className="italic font-serif normal-case text-amber-500">Bhutan Trip</span>
                    </h1>
                    <p className="mt-5 text-base md:text-lg text-white/80 font-light max-w-xl leading-relaxed">
                        {INTRO[step]}
                    </p>
                </div>
            </div>
        </section>
    );
}
