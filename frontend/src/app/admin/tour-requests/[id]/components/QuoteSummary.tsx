"use client";

import { Sparkles } from "lucide-react";
import { TourRequest } from "../../types";

interface QuoteSummaryProps {
    request: TourRequest;
}

function money(amount: number, currency?: string | null) {
    const symbol = (currency ?? "USD") === "USD" ? "$" : `${currency} `;
    return `${symbol}${Math.round(amount).toLocaleString("en-US")}`;
}

/**
 * What the traveller was actually shown at submit — the server-computed
 * subtotal, which discount won and why, and the final figure. The operator
 * needs this before they quote, or they'll contradict the estimate the
 * customer already has in their inbox.
 */
export function QuoteSummary({ request }: QuoteSummaryProps) {
    const percent = request.discountPercent ?? 0;
    const hasQuote = typeof request.quoteSubtotal === "number" && request.quoteSubtotal > 0;

    // Nothing was priced and nothing was discounted — no point in an empty box.
    if (!hasQuote && percent <= 0) return null;

    const basis =
        request.discountKind === "coupon"
            ? `Code ${request.couponCode ?? ""}`.trim()
            : `Returning traveller · ${request.priorTripCount ?? 0} previous ${
                  request.priorTripCount === 1 ? "trip" : "trips"
              }`;

    return (
        <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                Quote at Submission
            </h3>

            <div className="space-y-4">
                {hasQuote ? (
                    <>
                        <div className="flex items-baseline justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Subtotal
                            </span>
                            <span className="text-sm text-zinc-700">
                                {money(request.quoteSubtotal!, request.quoteCurrency)}
                            </span>
                        </div>

                        {percent > 0 && (
                            <div className="flex items-baseline justify-between">
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                                    Discount ({percent}%)
                                </span>
                                <span className="text-sm text-amber-600">
                                    -{money(request.discountAmount ?? 0, request.quoteCurrency)}
                                </span>
                            </div>
                        )}

                        <div className="flex items-baseline justify-between border-t border-gray-100 pt-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Total
                            </span>
                            <span className="text-lg font-semibold text-black">
                                {money(request.quoteTotal ?? request.quoteSubtotal!, request.quoteCurrency)}
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        No itinerary was priced for this enquiry — apply the discount below when you
                        build the quote.
                    </p>
                )}

                {percent > 0 && (
                    <div className="flex items-start gap-2 border border-amber-200 bg-amber-50/60 p-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-black">{percent}% discount applied</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{basis}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
