"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { CountrySelect } from "@/components/common/country-select";
import { CountryCodeSelect } from "@/components/common/country-code-select";
import { Turnstile } from "@/components/turnstile";
import { COUNTRIES } from "@/lib/countries";
import { CONSENT_TEXT } from "@/lib/promotions/consent";
import { claimCoupon } from "@/app/(portal)/plan-my-trip/actions";
import { PublicCampaign } from "./types";

interface ClaimCouponDialogProps {
    campaign: PublicCampaign;
    open: boolean;
    onClose: () => void;
    onClaimed: () => void;
}

export function ClaimCouponDialog({ campaign, open, onClose, onClaimed }: ClaimCouponDialogProps) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
    });
    const [phoneCountry, setPhoneCountry] = useState("BT");
    const [consent, setConsent] = useState(false);
    const [company, setCompany] = useState(""); // honeypot
    const [turnstileToken, setTurnstileToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [issuedCode, setIssuedCode] = useState("");

    const setField = (key: keyof typeof form, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.country) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (!consent) {
            toast.error("Please agree to be contacted so we can send your code.");
            return;
        }

        setIsSubmitting(true);
        const dialCode = COUNTRIES.find((c) => c.iso2 === phoneCountry)?.dialCode ?? "";

        const result = await claimCoupon({
            ...form,
            campaignId: campaign.id,
            phone: `${dialCode} ${form.phone}`.trim(),
            marketingConsent: true,
            company,
            turnstileToken,
        });
        setIsSubmitting(false);

        if (result.success && result.code) {
            setIssuedCode(result.code);
            onClaimed();
        } else if (result.success) {
            // Honeypot tripped — look like success and change nothing.
            onClose();
        } else {
            toast.error(result.error || "We couldn't issue a code. Please try again.");
        }
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(issuedCode);
            toast.success("Code copied.");
        } catch {
            toast.error("Couldn't copy — please note the code down.");
        }
    };

    const inputClass =
        "w-full text-black border-b border-black/10 py-3 text-base font-light focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none placeholder:text-gray-300";
    const labelClass =
        "text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 block mb-1";

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-8 sm:p-12 shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-5 right-5 p-1 text-gray-300 hover:text-black transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {issuedCode ? (
                            <div className="space-y-6 text-center py-6">
                                <div className="w-16 h-16 border border-green-600/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <Check className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-light uppercase tracking-tight text-black">
                                    Your code is{" "}
                                    <span className="italic normal-case text-amber-600">ready</span>
                                </h3>

                                <button
                                    type="button"
                                    onClick={copyCode}
                                    className="group inline-flex items-center gap-3 bg-black px-8 py-5 text-white"
                                >
                                    <span className="font-mono text-2xl tracking-[0.3em]">{issuedCode}</span>
                                    <Copy className="w-4 h-4 text-white/40 group-hover:text-amber-500 transition-colors" />
                                </button>

                                <p className="text-sm text-gray-500 font-light">
                                    We&apos;ve emailed it to <strong>{form.email}</strong> as well, so you
                                    won&apos;t lose it. Enter it when you plan your trip to take{" "}
                                    {campaign.discountPercent}% off your estimate.
                                </p>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600 font-mono">
                                        {"// "}{campaign.discountPercent}% off
                                    </span>
                                    <h3 className="text-3xl font-light uppercase tracking-tight text-black leading-tight">
                                        {campaign.bannerHeadline}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-light">
                                        Tell us where to send your code and we&apos;ll do the rest.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass} htmlFor="promo-first-name">First name</label>
                                        <input
                                            id="promo-first-name"
                                            className={inputClass}
                                            value={form.firstName}
                                            onChange={(e) => setField("firstName", e.target.value)}
                                            placeholder="Jigme"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass} htmlFor="promo-last-name">Last name</label>
                                        <input
                                            id="promo-last-name"
                                            className={inputClass}
                                            value={form.lastName}
                                            onChange={(e) => setField("lastName", e.target.value)}
                                            placeholder="Dorji"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass} htmlFor="promo-email">Email</label>
                                    <input
                                        id="promo-email"
                                        type="email"
                                        className={inputClass}
                                        value={form.email}
                                        onChange={(e) => setField("email", e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <div className="flex items-center gap-2 border-b border-black/10">
                                        <CountryCodeSelect value={phoneCountry} onChange={setPhoneCountry} />
                                        <input
                                            type="tel"
                                            className="w-full text-black py-3 text-base font-light focus:outline-none bg-transparent placeholder:text-gray-300"
                                            value={form.phone}
                                            onChange={(e) => setField("phone", e.target.value)}
                                            placeholder="17 123 456"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Nationality</label>
                                    <div className="border-b border-black/10">
                                        <CountrySelect
                                            value={form.country}
                                            onChange={(iso2) => {
                                                setField("country", iso2);
                                                setPhoneCountry(iso2);
                                            }}
                                            placeholder="Select your nationality"
                                        />
                                    </div>
                                </div>

                                {/* Honeypot — hidden from real users, irresistible to bots. */}
                                <input
                                    type="text"
                                    name="company"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="absolute left-[-9999px] w-px h-px opacity-0"
                                />

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-1 w-4 h-4 accent-amber-600 shrink-0"
                                    />
                                    <span className="text-xs text-gray-500 font-light leading-relaxed">
                                        {CONSENT_TEXT}
                                    </span>
                                </label>

                                <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-black py-5 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Issuing your code
                                        </>
                                    ) : (
                                        `Send me my ${campaign.discountPercent}% code`
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
