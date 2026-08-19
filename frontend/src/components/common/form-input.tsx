"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
    label: string;
    name: string;
    /** Validation message shown under the field. Also flags the input to assistive tech. */
    error?: string;
}

/**
 * The single underlined text field used by every public form (enquiry, package
 * request, custom builder). Previously each form carried its own near-identical
 * copy with no label/input association and no visible focus ring.
 */
export function FormInput({
    label,
    name,
    error,
    className,
    required = true,
    ...rest
}: FormInputProps) {
    const id = `field-${name}`;
    const errorId = `${id}-error`;

    return (
        <div className="space-y-4 group">
            <label
                htmlFor={id}
                className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors"
            >
                {label}
                {/* `required` defaults to true here, so before this every field was
                    mandatory and nothing said so until submission failed. The
                    asterisk is aria-hidden because the input's own `required`
                    attribute already carries this to assistive tech. */}
                {required ? (
                    <span aria-hidden className="text-amber-600"> *</span>
                ) : (
                    <span className="ml-2 font-normal normal-case tracking-normal text-gray-400">
                        (optional)
                    </span>
                )}
            </label>
            <input
                id={id}
                name={name}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                    "w-full border-b py-4 text-lg font-light text-black bg-transparent rounded-none transition-all",
                    "placeholder:text-gray-400",
                    "focus:outline-none focus:border-amber-600",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600",
                    error ? "border-rose-500" : "border-black/10",
                    className
                )}
                {...rest}
            />
            {error && (
                <p id={errorId} role="alert" className="text-[11px] font-medium text-rose-600">
                    {error}
                </p>
            )}
        </div>
    );
}
