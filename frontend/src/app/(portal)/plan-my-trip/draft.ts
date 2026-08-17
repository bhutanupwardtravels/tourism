"use client";

import { DayItinerary } from "@/app/admin/tour-requests/types";

/**
 * A half-built itinerary represents real effort the traveller spent BEFORE
 * giving us anything, so losing it to a refresh or a stray back-navigation is
 * expensive. Client-side only; cleared once the request is sent.
 */
export const DRAFT_KEY = "bhutan_trip_draft_v1";

const DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14;

export type DraftStep = "BASICS" | "ENTRY_POINT" | "BUILDER" | "CONTACT" | "SUCCESS";

export interface BuilderDraft {
    savedAt: number;
    step: DraftStep;
    days: DayItinerary[];
    userDetails: Record<string, unknown>;
    phoneCountry: string;
    activeDestinationId?: string | null;
}

export function readDraft(): BuilderDraft | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return null;
        const draft = JSON.parse(raw) as BuilderDraft;
        if (!draft?.savedAt || Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS) {
            localStorage.removeItem(DRAFT_KEY);
            return null;
        }
        return draft;
    } catch {
        return null;
    }
}

export function writeDraft(draft: BuilderDraft) {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
        // Private browsing / quota — the builder still works, just without a draft.
    }
}

export function clearDraft() {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch {
        // Nothing to clean up.
    }
}
