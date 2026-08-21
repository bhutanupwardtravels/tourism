"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { validateCoupon } from "@/app/(portal)/plan-my-trip/actions";
import { useTravellerLoyalty } from "@/hooks/use-traveller-loyalty";

interface DiscountNoticeProps {
    /** The email currently in the form. Debounced internally. */
    email: string;
    /** Reports the applied code upward so it can ride along on the submit payload.
     *  Only needed when the coupon field is shown. */
    onCouponChange?: (code: string) => void;
    /** Set false on forms that only ask a question — the general enquiry page has
     *  nothing to redeem a code against, so it shows the returning-traveller
     *  badge alone. */
    allowCoupon?: boolean;
    /** Reports the winning discount upward so the form can strike through its
     *  headline price. Fires only when the resolved figures actually change. */
    onDiscountChange?: (discount: ResolvedFormDiscount) => void;
}

export interface ResolvedFormDiscount {
    percent: number;
    kind: "none" | "loyalty" | "coupon";
    priorTrips: number;
    couponCode: string;
}

/**
 * Returning-traveller badge plus (optionally) a coupon field, for the flows that
 * have no computed trip cost — the curated-package form takes codes, the general
 * enquiry form is only a question and takes none.
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
export function DiscountNotice({
    email,
    onCouponChange,
    allowCoupon = true,
    onDiscountChange,
}: DiscountNoticeProps) {
    const { percent: loyaltyPercent, priorTrips } = useTravellerLoyalty(email);

    const [couponInput, setCouponInput] = useState("");
    const [appliedCode, setAppliedCode] = useState("");
    const [couponPercent, setCouponPercent] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [isChecking, setIsChecking] = useState(false);

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
                onCouponChange?.(result.code);
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
        onCouponChange?.("");
    };

    // Best-of, never stacked — the same rule the server applies. Ties go to the
    // coupon, since that is the one the traveller consciously redeemed.
    const bestPercent = Math.max(loyaltyPercent, couponPercent);
    const kind: ResolvedFormDiscount["kind"] =
        bestPercent === 0 ? "none" : couponPercent >= loyaltyPercent ? "coupon" : "loyalty";

    // Kept in a ref so a parent that re-creates the callback on every render
    // doesn't re-fire this — only a change in the numbers should reach the form.
    const reportRef = useRef(onDiscountChange);
    useEffect(() => {
        reportRef.current = onDiscountChange;
    }, [onDiscountChange]);
    useEffect(() => {
        reportRef.current?.({ percent: bestPercent, kind, priorTrips, couponCode: appliedCode });
    }, [bestPercent, kind, priorTrips, appliedCode]);

    return (
        <div className="space-y-6">
            {bestPercent > 0 && (
                <div className="flex items-start gap-3 border border-amber-600/30 bg-amber-50/50 p-5">
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <p className="text-sm text-black font-medium">
                            {kind === "loyalty"
                                ? `${bestPercent}% membership discount applied`
                                : `${bestPercent}% discount applied`}
                        </p>
                        <p className="text-xs text-gray-500 font-light">
                            {kind === "coupon"
                                ? `Code ${appliedCode} accepted.`
                                : `Welcome back — you've travelled with us ${priorTrips} ${priorTrips === 1 ? "time" : "times"}.`}
                            {" "}Our team will confirm the final figure with your itinerary.
                        </p>
                    </div>
                </div>
            )}

            {allowCoupon && (
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
                                    className="shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 transition-colors"
                                >
                                    {isChecking ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                                </button>
                            </div>
                            {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
