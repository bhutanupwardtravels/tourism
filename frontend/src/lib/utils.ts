import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Escapes a string for safe interpolation into HTML (e.g. email templates).
 * Prevents user-supplied form input from injecting markup or links.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Renders a stored experience duration in units a reader can act on.
 *
 * Durations are free text entered in the admin panel and are conventionally
 * written in hours. Past a day that unit stops being readable — "48 Hours" for
 * a trek makes the reader do the arithmetic, and understates a multi-day trip
 * at a glance. Whole multiples of 24 are converted to days.
 *
 * Anything that is not a whole number of days is returned untouched. A value
 * like "90 Hours" is far more likely to be a data-entry mistake than a real
 * 3.75-day activity, and rounding it to "4 days" would launder the error into
 * something that looks deliberate.
 */
export function formatDuration(duration?: string | null): string {
  if (!duration) return "";

  const match = /^\s*(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\s*$/i.exec(duration);
  if (!match) return duration;

  const hours = Number(match[1]);
  if (!Number.isFinite(hours) || hours < 24 || hours % 24 !== 0) return duration;

  const days = hours / 24;
  return `${days} ${days === 1 ? "Day" : "Days"}`;
}

/**
 * Returns a shallow copy of `obj` without the given keys.
 *
 * Used when persisting content documents: the `updatedAt` field lives in its
 * own column, so it must not be duplicated inside the jsonb payload.
 */
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  for (const key of keys) delete result[key as string];
  return result as Omit<T, K>;
}
