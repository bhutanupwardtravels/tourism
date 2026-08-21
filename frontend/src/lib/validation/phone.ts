import { z } from "zod";

/**
 * Phone numbers are entered as a national number next to a separate dial-code
 * picker, then stored as "<dialCode> <number>". Nothing validated the number
 * itself, so "abcdefg" was a perfectly acceptable way to be contacted.
 */

/** Everything a phone number may legitimately contain: digits and grouping punctuation. */
const ALLOWED_PHONE_CHARS = /^[\d\s()+.\-]*$/;
const DISALLOWED_PHONE_CHARS = /[^\d\s()+.\-]/g;

/** Shortest/longest national number we accept (dial code excluded). */
export const MIN_PHONE_DIGITS = 6;
export const MAX_PHONE_DIGITS = 15;

/** Strips anything that isn't a digit or grouping punctuation. Applied on every
 *  keystroke, so letters simply never appear rather than failing on submit. */
export function sanitizePhoneInput(value: string): string {
    return value.replace(DISALLOWED_PHONE_CHARS, "");
}

export function countPhoneDigits(value: string): number {
    return (value.match(/\d/g) ?? []).length;
}

/**
 * Validates the national number typed alongside a dial code.
 * Returns an error message, or null when the number is acceptable.
 */
export function validatePhoneNumber(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Please enter a phone number.";
    if (!ALLOWED_PHONE_CHARS.test(trimmed)) {
        return "Phone numbers can only contain digits.";
    }
    const digits = countPhoneDigits(trimmed);
    if (digits < MIN_PHONE_DIGITS) {
        return `Please enter a valid phone number (at least ${MIN_PHONE_DIGITS} digits).`;
    }
    if (digits > MAX_PHONE_DIGITS) {
        return "That phone number looks too long.";
    }
    return null;
}

/**
 * Server-side check for the stored "<dialCode> <number>" form. Deliberately
 * looser than the client rule — the dial code adds up to four digits, and this
 * only has to stop junk from non-browser submissions.
 */
export const phoneSchema = z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(40)
    .regex(ALLOWED_PHONE_CHARS, "Phone number can only contain digits")
    .refine((value) => {
        const digits = countPhoneDigits(value);
        return digits >= 7 && digits <= 20;
    }, "Please enter a valid phone number");
