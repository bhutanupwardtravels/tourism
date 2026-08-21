"use client";

import { useEffect, useState } from "react";

import { lookupTravellerDiscount } from "@/app/(portal)/plan-my-trip/actions";

export interface TravellerLoyalty {
    /** Discount earned from past trips, already capped by the configured ceiling. */
    percent: number;
    priorTrips: number;
    /** True while a lookup for the current address is in flight. */
    isChecking: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Looks up the returning-traveller discount for whatever address is currently
 * typed. Debounced so a lookup doesn't fire on every keystroke, and every state
 * write happens inside the timer — an incomplete address costs nothing.
 *
 * Display only: submitTourRequest recounts the trips server-side and stores its
 * own figure, so a stale or spoofed answer here can't change what's charged.
 */
export function useTravellerLoyalty(email: string): TravellerLoyalty {
    const [percent, setPercent] = useState(0);
    const [priorTrips, setPriorTrips] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const timer = setTimeout(async () => {
            const trimmed = email.trim();
            if (!EMAIL_PATTERN.test(trimmed)) {
                if (!cancelled) {
                    setPercent(0);
                    setPriorTrips(0);
                }
                return;
            }

            if (!cancelled) setIsChecking(true);
            try {
                const result = await lookupTravellerDiscount(trimmed);
                if (cancelled) return;
                setPercent(result.percent);
                setPriorTrips(result.priorTrips);
            } catch {
                if (!cancelled) {
                    setPercent(0);
                    setPriorTrips(0);
                }
            } finally {
                if (!cancelled) setIsChecking(false);
            }
        }, 700);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [email]);

    return { percent, priorTrips, isChecking };
}
