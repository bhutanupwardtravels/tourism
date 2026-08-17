"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { PublicCampaign } from "./types";
import { ClaimCouponDialog } from "./claim-coupon-dialog";

// Long enough that the visitor has started reading rather than just landed.
const APPEAR_AFTER_MS = 8000;

// Never interrupt someone who is already converting.
const SUPPRESSED_PATHS = ["/plan-my-trip", "/enquire"];

function dismissKey(id: string) {
    return `promo_dismissed_${id}`;
}

function claimedKey(id: string) {
    return `promo_claimed_${id}`;
}

/**
 * Bottom-left slide-in offering a discount code in exchange for contact details.
 *
 * Bottom-*left* on purpose: the chat widget owns bottom-right.
 *
 * The campaign window is re-checked here against the browser clock, because the
 * public layout is ISR'd with revalidate = 3600 — a purely server-side check
 * could leave a finished campaign on screen for an hour after it ended.
 */
export function PromoBanner({ campaign }: { campaign: PublicCampaign | null }) {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const suppressed = SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p));

    // The effect only ever arms the timer; suppression is handled at render
    // time below, so navigating to /plan-my-trip doesn't cost a re-render.
    useEffect(() => {
        if (!campaign || suppressed) return;

        const now = Date.now();
        if (campaign.bannerStartsAt && new Date(campaign.bannerStartsAt).getTime() > now) return;
        if (campaign.bannerEndsAt && new Date(campaign.bannerEndsAt).getTime() < now) return;

        try {
            if (localStorage.getItem(dismissKey(campaign.id))) return;
            if (localStorage.getItem(claimedKey(campaign.id))) return;
        } catch {
            // Private browsing with storage disabled — show it rather than not.
        }

        const timer = setTimeout(() => setVisible(true), APPEAR_AFTER_MS);
        return () => clearTimeout(timer);
    }, [campaign, suppressed]);

    if (!campaign) return null;

    const dismiss = () => {
        setVisible(false);
        try {
            localStorage.setItem(dismissKey(campaign.id), "1");
        } catch {
            // Nothing to do — it'll reappear next visit, which is acceptable.
        }
    };

    const onClaimed = () => {
        setClaimed(true);
        try {
            localStorage.setItem(claimedKey(campaign.id), "1");
        } catch {
            // See above.
        }
    };

    return (
        <>
            <AnimatePresence>
                {visible && !suppressed && !dialogOpen && !claimed && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, x: -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed bottom-6 left-6 z-50 w-[calc(100vw-3rem)] max-w-sm bg-black text-white shadow-2xl shadow-black/40"
                    >
                        <button
                            type="button"
                            onClick={dismiss}
                            aria-label="Dismiss offer"
                            className="absolute top-3 right-3 p-1 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-7 space-y-4">
                            <div className="flex items-center gap-2 text-amber-500">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                                    {campaign.discountPercent}% Off
                                </span>
                            </div>

                            <h3 className="text-2xl font-light uppercase tracking-tight leading-tight">
                                {campaign.bannerHeadline}
                            </h3>

                            {campaign.bannerBody && (
                                <p className="text-sm text-white/60 font-light leading-relaxed">
                                    {campaign.bannerBody}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => setDialogOpen(true)}
                                className="w-full bg-amber-600 hover:bg-amber-500 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors"
                            >
                                {campaign.bannerCtaLabel}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ClaimCouponDialog
                campaign={campaign}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onClaimed={onClaimed}
            />
        </>
    );
}
