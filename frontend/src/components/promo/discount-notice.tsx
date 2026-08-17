"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { lookupTravellerDiscount, validateCoupon } from "@/app/(portal)/plan-my-trip/actions";

interface DiscountNoticeProps {
    /** The email currently in the form. Debounced internally. */
    email: string;
    /** Reports the applied code upward so it can ride along on the submit payload. */
    onCouponChange: (code: string) => void;
}

/**
 * Returning-traveller badge plus a coupon field, for the flows that have no
 * computed trip cost (the curated-package form and the general enquiry form).
 *
 * These forms collect a bucketed traveller count ("3-4") rather than real
 * numbers, so there is nothing here to discount against. The percentage is
 * still resolved and stored on the request, and the operator applies it when
 * they build the quote — which is why the copy promises a discount on the quote
 * rather than showing a figure.
 *
 * Everything shown here is advisory; submitTourRequest resolves the real
 * discount server-side.
 */
export function DiscountNotice({ email, onCouponChange }: DiscountNoticeProps) {
    const [loyaltyPercent, setLoyaltyPercent] = useState(0);
    const [priorTrips, setPriorTrips] = useState(0);

    const [couponInput, setCouponInput] = useState("");
    const [appliedCode, setAppliedCode] = useState("");
    const [couponPercent, setCouponPercent] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    // Debounced so we aren't calling the lookup on every keystroke. All the
    // state writes happen inside the timer rather than in the effect body, so
    // an incomplete address doesn't trigger a synchronous re-render per key.
    useEffect(() => {
        let cancelled = false;

        const timer = setTimeout(async () => {
            const trimmed = email.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                if (!cancelled) {
                    setLoyaltyPercent(0);
                    setPriorTrips(0);
                }
                return;
            }

            try {
                const result = await lookupTravellerDiscount(trimmed);
                if (cancelled) return;
                setLoyaltyPercent(result.percent);
                setPriorTrips(result.priorTrips);
            } catch {
                if (!cancelled) {
                    setLoyaltyPercent(0);
                    setPriorTrips(0);
                }
            }
        }, 700);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [email]);

    const applyCoupon = async () => {
        const code = couponInput.trim().toUpperCase();
        if (!code) return;

        setIsChecking(true);
        setCouponError("");
        try {
            const result = await validateCoupon(code, email);
            if (result.valid) {
                setAppliedCode(result.code);
                setCouponPercent(result.percent);
                onCouponChange(result.code);
            } else {
                setCouponError(result.reason);
            }
        } catch {
            setCouponError("We couldn't verify that code. Please try again.");
        }
        setIsChecking(false);
    };

    const clearCoupon = () => {
        setAppliedCode("");
        setCouponPercent(0);
        setCouponInput("");
        setCouponError("");
        onCouponChange("");
    };

    // Best-of, never stacked — the same rule the server applies.
    const bestPercent = Math.max(loyaltyPercent, couponPercent);

    return (
        <div className="space-y-6">
            {bestPercent > 0 && (
                <div className="flex items-start gap-3 border border-amber-600/30 bg-amber-50/50 p-5">
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <p className="text-sm text-black font-medium">
                            {bestPercent}% discount will be applied to your quote
                        </p>
                        <p className="text-xs text-gray-500 font-light">
                            {couponPercent >= loyaltyPercent
                                ? `Code ${appliedCode} accepted.`
                                : `Welcome back — you've travelled with us ${priorTrips} ${priorTrips === 1 ? "time" : "times"}.`}
                            {" "}Our team will confirm the final figure with your itinerary.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 block">
                    Discount code <span className="normal-case tracking-normal font-light text-gray-400">(optional)</span>
                </label>

                {appliedCode ? (
                    <div className="flex items-center justify-between gap-4 border-b border-black/10 py-3">
                        <span className="font-mono text-sm tracking-widest text-black">{appliedCode}</span>
                        <button
                            type="button"
                            onClick={clearCoupon}
                            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 border-b border-black/10 focus-within:border-amber-600 transition-all">
                            <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => {
                                    setCouponInput(e.target.value.toUpperCase());
                                    setCouponError("");
                                }}
                                placeholder="BHU-XXXXXX"
                                className="w-full bg-transparent py-3 font-mono text-base tracking-widest text-black placeholder:text-gray-300 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={applyCoupon}
                                disabled={isChecking || !couponInput.trim()}
                                className="shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white hover:bg-amber-600 disabled:opacity-30 disabled:hover:bg-black transition-colors"
                            >
                                {isChecking ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                            </button>
                        </div>
                        {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
                    </>
                )}
            </div>
        </div>
    );
}
