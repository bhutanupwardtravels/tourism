"use client";

import { CountryCodeSelect } from "@/components/common/country-code-select";
import { cn } from "@/lib/utils";
import { sanitizePhoneInput } from "@/lib/validation/phone";

interface PhoneFieldProps {
    /** Unique id — also names the label so the two stay associated. */
    id: string;
    /** ISO2 country code driving the dial-code picker. */
    country: string;
    onCountryChange: (iso2: string) => void;
    value: string;
    /** Receives the sanitized value — letters are stripped before it fires. */
    onChange: (value: string) => void;
    /** Validation message shown under the field. */
    error?: string;
    label?: string;
    required?: boolean;
    /** Compact spacing for the coupon dialog; "default" matches FormInput. */
    variant?: "default" | "compact";
    className?: string;
    /** Extra classes for the dial-code dropdown panel — needed inside overlays
     *  stacked above the popover's default z-50. */
    selectContentClassName?: string;
}

/** Brings an invalid phone field into view and focuses it — the submit button
 *  can sit a screen below, so otherwise a failed check looks like nothing happened. */
export function focusPhoneField(id: string) {
    const input = document.getElementById(id);
    if (!(input instanceof HTMLInputElement)) return;
    input.scrollIntoView({ behavior: "smooth", block: "center" });
    input.focus({ preventScroll: true });
}

/**
 * The dial-code picker + national number pair used by every public form.
 * Keeping it in one place is what lets the "digits only" rule hold everywhere.
 */
export function PhoneField({
    id,
    country,
    onCountryChange,
    value,
    onChange,
    error,
    label = "Phone",
    required = true,
    variant = "default",
    className,
    selectContentClassName,
}: PhoneFieldProps) {
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;
    const compact = variant === "compact";

    return (
        <div className={cn(compact ? "group" : "space-y-4 group", className)}>
            <label
                id={labelId}
                htmlFor={id}
                className={cn(
                    "block text-[10px] font-bold uppercase tracking-[0.3em] transition-colors",
                    compact ? "text-gray-400 mb-1" : "text-black group-focus-within:text-amber-600"
                )}
            >
                {label}
                {required && !compact && <span aria-hidden className="text-amber-600"> *</span>}
            </label>
            <div
                className={cn(
                    "flex items-center border-b transition-all focus-within:border-amber-600",
                    compact ? "gap-2" : "gap-3",
                    error ? "border-rose-500" : "border-black/10"
                )}
            >
                <CountryCodeSelect
                    value={country}
                    onChange={onCountryChange}
                    ariaLabelledBy={labelId}
                    contentClassName={selectContentClassName}
                />
                <input
                    id={id}
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    required={required}
                    autoComplete="tel"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    value={value}
                    onChange={(event) => onChange(sanitizePhoneInput(event.target.value))}
                    className={cn(
                        "w-full min-w-0 font-light text-black bg-transparent rounded-none",
                        "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600",
                        compact ? "py-3 text-base placeholder:text-gray-300" : "py-4 text-lg placeholder:text-gray-400"
                    )}
                    placeholder="17 123 456"
                />
            </div>
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className={cn("text-[11px] font-medium text-rose-600", compact && "mt-1")}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
