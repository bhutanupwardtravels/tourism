import { format, isValid, parseISO } from "date-fns";

/**
 * Festivals are experiences — they live in the same table and differ only by
 * category. What earns an entry the festivals section is a fixed date window:
 * that's the one thing a festival card says which the experience grid can't.
 *
 * Splitting on that keeps the two destination sections disjoint. A festival
 * whose dates aren't filled in yet stays an ordinary experience rather than
 * showing up as a "cultural festival" with nothing to attend.
 */
export type FestivalLike = {
    title: string;
    slug: string;
    category: string;
    startDate?: string | null;
    endDate?: string | null;
};

export function isFestival(item: FestivalLike): boolean {
    if (!item.startDate || !item.endDate) return false;
    // Category is the real signal; title/slug cover entries filed under a
    // neighbouring category but named for the festival they cover.
    return `${item.category} ${item.title} ${item.slug}`.toLowerCase().includes("festival");
}

/** Partition experiences into the two mutually exclusive destination sections. */
export function splitFestivals<T extends FestivalLike>(items: T[]) {
    const festivals: T[] = [];
    const experiences: T[] = [];
    for (const item of items) {
        (isFestival(item) ? festivals : experiences).push(item);
    }
    return { festivals, experiences };
}

/**
 * Render a festival's date window the way both the card and the detail hero
 * show it: collapse whatever the two dates share, so a run inside one month
 * reads "March 27 – 30, 2026" rather than repeating the month and year.
 *
 * Dates are stored date-only ("2026-03-27"); parseISO reads those as local
 * midnight, where `new Date()` would read UTC and slide the day backwards for
 * anyone west of Greenwich.
 */
export function formatFestivalDates(
    start?: string | null,
    end?: string | null,
    month: "long" | "short" = "long"
): string | null {
    const from = toDate(start);
    if (!from) return null;

    const m = month === "short" ? "MMM" : "MMMM";
    const to = toDate(end);
    if (!to) return format(from, `${m} dd, yyyy`);

    if (from.getFullYear() === to.getFullYear()) {
        if (from.getMonth() === to.getMonth()) {
            return `${format(from, `${m} dd`)} – ${format(to, "dd, yyyy")}`;
        }
        return `${format(from, `${m} dd`)} – ${format(to, `${m} dd, yyyy`)}`;
    }
    return `${format(from, `${m} dd, yyyy`)} – ${format(to, `${m} dd, yyyy`)}`;
}

function toDate(value?: string | null): Date | null {
    if (!value) return null;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
}
