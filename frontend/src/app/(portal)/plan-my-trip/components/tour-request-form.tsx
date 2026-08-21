"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { SUBMIT_BUTTON, SUBMIT_SWEEP } from "@/components/common/submit-button";
import { submitTourRequest } from "../actions";
import { Tour } from "@/app/(website)/tours/schema";
import { Turnstile } from "@/components/turnstile";
import { DiscountNotice, ResolvedFormDiscount } from "@/components/promo/discount-notice";
import { ReturningTravellerHint } from "@/components/promo/returning-traveller-hint";
import { FormInput } from "@/components/common/form-input";
import { PhoneField, focusPhoneField } from "@/components/common/phone-field";
import { CountrySelect } from "@/components/common/country-select";
import { MonthSelect } from "@/components/common/month-select";
import { OptionSelect } from "@/components/common/option-select";
import { COUNTRIES } from "@/lib/countries";
import { applyDiscount } from "@/lib/pricing/quote";
import { validatePhoneNumber } from "@/lib/validation/phone";

const TRAVELER_OPTIONS = [
    { value: "1", label: "Just me" },
    { value: "2", label: "2 travellers" },
    { value: "3-4", label: "3-4 travellers" },
    { value: "5-8", label: "5-8 travellers" },
    { value: "9+", label: "9 or more travellers" },
];

interface TourRequestFormProps {
    selectedTour: Tour | null;
    onBack: () => void;
}

export function TourRequestForm({ selectedTour, onBack }: TourRequestFormProps) {
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "", // ISO2 country code (analytics)
        travelDate: "",
        travelers: "",
        message: "",
    });
    const [phoneCountry, setPhoneCountry] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const [company, setCompany] = useState(""); // honeypot
    // Advisory only: submitTourRequest re-validates the code server-side.
    const [couponCode, setCouponCode] = useState("");
    // Whichever of loyalty/coupon wins, for the struck-through headline price.
    const [discount, setDiscount] = useState<ResolvedFormDiscount>({
        percent: 0,
        kind: "none",
        priorTrips: 0,
        couponCode: "",
    });

    // The card price is the per-person headline for the package. Showing the
    // struck-through original next to the discounted figure is the whole point
    // of resolving the discount this early — advisory, like everything else here.
    const listPrice = selectedTour?.price ?? 0;
    const discountedPrice = applyDiscount(listPrice, discount.percent);
    const showsDiscountedPrice = discount.percent > 0 && listPrice > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        const phoneProblem = validatePhoneNumber(formState.phone);
        if (phoneProblem) {
            setPhoneError(phoneProblem);
            focusPhoneField("request-phone");
            return;
        }

        setIsSubmitting(true);

        const dialCode = COUNTRIES.find((c) => c.iso2 === phoneCountry)?.dialCode ?? "";

        const payload = {
            ...formState,
            phone: `${dialCode} ${formState.phone}`.trim(),
            company, // honeypot
            turnstileToken,
            couponCode: couponCode || undefined,
            tourId: selectedTour ? selectedTour._id : undefined,
            tourName: selectedTour ? selectedTour.title : undefined,
        };

        const result = await submitTourRequest(payload);

        if (result.success) {
            setIsSubmitted(true);
        } else {
            setSubmitError(result.error || "Something went wrong. Please try again.");
        }
        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full text-center space-y-12 py-24 mx-auto"
            >
                <div className="w-24 h-24 border border-green-600/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <motion.div
                        className="w-10 h-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <Check className="w-10 h-10" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.6em] block font-bold">
                        {"// request received"}
                    </span>
                    <h2 className="text-5xl font-light tracking-tighter uppercase text-black">
                        Request <span className="italic font-serif normal-case text-amber-600">Confirmed</span>
                    </h2>
                    <p className="text-black leading-relaxed text-xl font-light italic max-w-lg mx-auto">
                        &quot;Got it. A specialist will email you a tailored plan and the full price for
                        {selectedTour?.title ? ` ${selectedTour.title}` : " your trip"} within 24 business hours.&quot;
                    </p>
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="group inline-flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:text-black transition-all"
                    >
                        Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="flex justify-between items-end mb-24 border-b border-black/5 pb-12">
                <div className="space-y-4">
                    <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] font-bold block">
                        {"// finalization"}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-light tracking-tighter uppercase leading-none text-black">
                        Complete <span className="italic font-serif normal-case text-amber-600">Inquiry</span>
                    </h2>
                </div>
                <button
                    onClick={onBack}
                    className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-amber-500 transition-colors"
                >
                    <span className="w-8 h-px bg-gray-200 group-hover:w-12 group-hover:bg-amber-500 transition-all" />
                    Back to Selection
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-12 xl:gap-24">
                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="relative aspect-4/5 overflow-hidden rounded-xs group">
                        {selectedTour?.image && (
                            <Image
                                src={selectedTour?.image}
                                alt={selectedTour?.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="inline-block bg-amber-600/90 backdrop-blur-sm px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white">
                                    {"// Your itinerary"}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-3xl font-light uppercase tracking-tight text-white mb-2 leading-none">
                                    {selectedTour?.title}
                                </h3>
                                <p className="text-white/60 text-sm font-light italic mb-6 line-clamp-2">
                                    &quot;{selectedTour?.description}&quot;
                                </p>
                                <div className="border-t border-white/20 pt-6 flex justify-between items-end">
                                    <div>
                                        <span className="block text-[8px] uppercase tracking-widest text-white/50 mb-1">Investment</span>
                                        {showsDiscountedPrice ? (
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-mono text-sm text-white/40 line-through">
                                                    ${listPrice.toLocaleString()}
                                                </p>
                                                <p className="font-mono text-lg text-amber-500">
                                                    ${discountedPrice.total.toLocaleString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="font-mono text-lg text-amber-500">
                                                ${listPrice.toLocaleString()}
                                            </p>
                                        )}
                                        {showsDiscountedPrice && (
                                            <span className="block text-[8px] uppercase tracking-widest text-amber-500/70 mt-1">
                                                {discount.percent}% {discount.kind === "loyalty" ? "membership" : "code"} discount
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[8px] uppercase tracking-widest text-white/50 mb-1">Duration</span>
                                        <p className="font-mono text-sm text-white">{selectedTour?.duration}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-16">
                        {/* Personal Name Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            <FormInput
                                label="First name"
                                name="firstName"
                                autoComplete="given-name"
                                placeholder="Enter first name"
                                value={formState.firstName}
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Last name"
                                name="lastName"
                                autoComplete="family-name"
                                placeholder="Enter last name"
                                value={formState.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Contact Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            {/* Above the email field on purpose: the loyalty discount is
                                resolved from the address alone, so a returning traveller
                                has to be told before they type the wrong one. */}
                            <ReturningTravellerHint className="md:col-span-2" />
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={formState.email}
                                onChange={handleChange}
                            />
                            <div className="space-y-4 group">
                                <label id="request-country-label" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                    Country
                                </label>
                                <div className="border-b border-black/10 focus-within:border-amber-600 transition-all">
                                    <CountrySelect
                                        value={formState.country}
                                        onChange={(iso2) => {
                                            setFormState({ ...formState, country: iso2 });
                                            // Default the phone code to match — still independently editable below.
                                            setPhoneCountry(iso2);
                                        }}
                                        placeholder="Select your country"
                                        ariaLabelledBy="request-country-label"
                                    />
                                </div>
                            </div>
                            <PhoneField
                                id="request-phone"
                                className="md:col-span-2"
                                country={phoneCountry}
                                onCountryChange={setPhoneCountry}
                                value={formState.phone}
                                onChange={(phone) => {
                                    setPhoneError("");
                                    setFormState((prev) => ({ ...prev, phone }));
                                }}
                                error={phoneError}
                            />
                        </div>

                        {/* Travel Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            <div className="space-y-4 group">
                                <label id="request-travellers-label" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                    How many people?
                                </label>
                                <div className="border-b border-black/10 focus-within:border-amber-600 transition-all">
                                    <OptionSelect
                                        value={formState.travelers}
                                        onChange={(travelers) => setFormState({ ...formState, travelers })}
                                        options={TRAVELER_OPTIONS}
                                        placeholder="Select group size"
                                        ariaLabelledBy="request-travellers-label"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 group">
                                <label id="request-month-label" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                    When do you want to travel?
                                </label>
                                <div className="border-b border-black/10 focus-within:border-amber-600 transition-all">
                                    <MonthSelect
                                        value={formState.travelDate}
                                        onChange={(month) => setFormState({ ...formState, travelDate: month })}
                                        placeholder="Select month"
                                        ariaLabelledBy="request-month-label"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Large Message Area */}
                        <div className="space-y-4 group">
                            <label htmlFor="request-message" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                Anything we should know?
                            </label>
                            <textarea
                                id="request-message"
                                name="message"
                                rows={4}
                                value={formState.message}
                                onChange={handleChange}
                                className="w-full text-black border-b border-black/10 py-4 text-lg font-light focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none resize-none placeholder:text-gray-300 italic serif"
                                placeholder="Describe your vision, interests, or any special moments you wish to experience..."
                            />
                        </div>

                        <DiscountNotice
                            email={formState.email}
                            onCouponChange={setCouponCode}
                            onDiscountChange={setDiscount}
                        />

                        {/* Honeypot — hidden from real users, catches bots */}
                        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                            <label>
                                Company
                                <input
                                    type="text"
                                    name="company"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Bot verification */}
                        <div className="pt-4">
                            <Turnstile
                                onVerify={setTurnstileToken}
                                onExpire={() => setTurnstileToken("")}
                            />
                        </div>

                        {submitError && (
                            <p className="text-sm text-red-600 font-light">{submitError}</p>
                        )}

                        {/* Action Button */}
                        <div className="pt-12">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={SUBMIT_BUTTON}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                    {isSubmitting ? "Sending..." : "Send my request"}
                                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />}
                                </span>
                                <div aria-hidden className={SUBMIT_SWEEP} />
                            </button>
                        </div>

                        {/* Matches the close on /enquire. This is the higher-intent
                            form of the two, so it should not make the weaker promise. */}
                        <div className="text-center">
                            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest leading-loose">
                                A specialist replies within 24 business hours. <br />
                                By submitting, you agree to our{" "}
                                <Link href="/privacy" className="underline hover:text-amber-600">
                                    privacy policy
                                </Link>
                                .
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

