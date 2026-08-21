"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { SUBMIT_BUTTON, SUBMIT_SWEEP } from "@/components/common/submit-button";
import { Turnstile } from "@/components/turnstile";
import { DiscountNotice } from "@/components/promo/discount-notice";
import { submitTourRequest } from "@/app/(portal)/plan-my-trip/actions";
import { FormInput } from "@/components/common/form-input";
import { PhoneField, focusPhoneField } from "@/components/common/phone-field";
import { CountrySelect } from "@/components/common/country-select";
import { MonthSelect } from "@/components/common/month-select";
import { OptionSelect } from "@/components/common/option-select";
import { COUNTRIES } from "@/lib/countries";
import { validatePhoneNumber } from "@/lib/validation/phone";
import { Reveal } from "@/components/ui/reveal";

const TRAVELER_OPTIONS = [
    { value: "1", label: "Just me" },
    { value: "2", label: "2 travellers" },
    { value: "3-4", label: "3-4 travellers" },
    { value: "5-8", label: "5-8 travellers" },
    { value: "9+", label: "9 or more travellers" },
];

export default function EnquireClient() {
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "", // ISO2 country code (analytics)
        destination: "Bhutan",
        travelDate: "",
        travelers: "",
        message: "",
    });

    const [phoneCountry, setPhoneCountry] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [company, setCompany] = useState(""); // honeypot — hidden from real users
    const [turnstileToken, setTurnstileToken] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const phoneProblem = validatePhoneNumber(formState.phone);
        if (phoneProblem) {
            setPhoneError(phoneProblem);
            focusPhoneField("enquire-phone");
            return;
        }

        setIsSubmitting(true);

        const dialCode = COUNTRIES.find((c) => c.iso2 === phoneCountry)?.dialCode ?? "";

        const result = await submitTourRequest({
            ...formState,
            phone: `${dialCode} ${formState.phone}`.trim(),
            company,
            turnstileToken,
            tourName: "General Enquiry",
        });

        setIsSubmitting(false);
        if (result.success) {
            setIsSubmitted(true);
        } else {
            toast.error(result.error || "Failed to submit enquiry. Please try again.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">
                {/* Background Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <Image
                        src="/images/cinematic/enquire-hero.png"
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover filter grayscale"
                    />
                </div>

                <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
                    <div className="w-24 h-24 border border-amber-600/30 rounded-full flex items-center justify-center mx-auto text-amber-600">
                        <Check className="w-10 h-10" />
                    </div>

                    <div className="space-y-4">
                        <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.6em] block font-bold">
                            {"// enquiry received"}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tighter mb-12 uppercase drop-shadow-2xl">
                            Thank you &mdash; we&rsquo;ve{" "}
                            <span className="italic font-serif normal-case text-amber-600">got it</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light italic">
                            A travel specialist will email you within 24 business hours with a
                            suggested itinerary and a full price. If it&rsquo;s urgent, call or
                            WhatsApp us &mdash; the numbers are in the menu.
                        </p>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => window.location.href = "/"}
                            className="group inline-flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all"
                        >
                            Back to the site <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-amber-100">
            {/* Hero — shares the shell used by /about-us, /tours/[slug] and the
                destination and experience detail pages. */}
            <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-28 pt-36 md:pt-44">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/cinematic/enquire-hero.png"
                        alt=""
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover"
                    />
                    {/* Cinematic Overlays */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                    <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
                    {/* Flat scrim: the vertical gradient goes fully transparent through
                        the middle of the hero, which is exactly where the headline sits. */}
                    <div className="absolute inset-0 bg-black/25" />
                </div>

                {/* Animated Light Leak */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen"
                />

                {/* Background Large Text — decorative tint only. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[16vw] font-bold uppercase leading-none tracking-tighter text-amber-500/15 whitespace-nowrap"
                >
                    Enquire
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">
                    <span className="font-mono text-amber-400 text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                        {"// tailor your vision"}
                    </span>

                    <h1 className="mb-8 text-balance text-[clamp(2.5rem,8vw,6.5rem)] font-light uppercase leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
                        Begin Your{" "}
                        <span className="italic font-serif normal-case text-amber-500">Odyssey</span>
                    </h1>

                    <p className="max-w-2xl text-balance text-base md:text-xl text-gray-200 font-light leading-relaxed font-serif italic mx-auto">
                        &quot;Tell us the texture of your curiosity. Every journey we plan is a unique weave in the tapestry of the Kingdom of Bhutan.&quot;
                    </p>

                    <div className="flex items-center justify-center gap-4 md:gap-8 mt-12 md:mt-16">
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: 80 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="hidden sm:block h-px bg-linear-to-r from-transparent to-amber-500"
                        />
                        <span className="font-mono text-xs tracking-[0.4em] uppercase text-gray-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                            Replies within 24 hours
                        </span>
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: 80 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="hidden sm:block h-px bg-linear-to-l from-transparent to-amber-500"
                        />
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-32 md:py-48 container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-12 xl:gap-24">
                    {/* Lateral Label Section */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-6">
                            <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] font-bold block">
                                {"// enquiry details"}
                            </span>
                            <h2 className="text-4xl font-light tracking-tighter uppercase leading-tight text-black">
                                Personal <span className="italic font-serif normal-case text-amber-600">Discovery</span>
                            </h2>
                            <p className="text-black font-light leading-relaxed">
Tell us roughly when you want to travel and who&apos;s coming. We&apos;ll come back with a suggested itinerary and a full price, including the Sustainable Development Fee.
                            </p>
                        </div>

                        <div className="pt-12 border-t border-black/5 space-y-8">
                            <div className="flex items-start gap-6 group">
                                <span className="font-mono text-xs text-amber-600 pt-1 font-bold">[01]</span>
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Response Time</h3>
                                    <p className="text-xs text-black font-medium">Within 24 business hours</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <span className="font-mono text-xs text-amber-600 pt-1 font-bold">[02]</span>
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Tailored Planning</h3>
                                    <p className="text-xs text-black font-medium">Bespoke itineraries, zero templates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Form */}
                    <div className="lg:col-span-8">
                        <Reveal as="form" y={0} x={20} duration={1}
                            onSubmit={handleSubmit}
                            className="space-y-16">
                            {/* Personal Name Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 transform transition-all duration-500">
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
                                    <label id="enquire-country-label" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
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
                                            ariaLabelledBy="enquire-country-label"
                                        />
                                    </div>
                                </div>
                                <PhoneField
                                    id="enquire-phone"
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
                                    <label id="enquire-travellers-label" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                        How many people?
                                    </label>
                                    <div className="border-b border-black/10 focus-within:border-amber-600 transition-all">
                                        <OptionSelect
                                            value={formState.travelers}
                                            onChange={(travelers) => setFormState({ ...formState, travelers })}
                                            options={TRAVELER_OPTIONS}
                                            placeholder="Select group size"
                                            ariaLabelledBy="enquire-travellers-label"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 group">
                                    <label id="enquire-month-label" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                        When do you want to travel?
                                    </label>
                                    <div className="border-b border-black/10 focus-within:border-amber-600 transition-all">
                                        <MonthSelect
                                            value={formState.travelDate}
                                            onChange={(month) => setFormState({ ...formState, travelDate: month })}
                                            placeholder="Select month"
                                            ariaLabelledBy="enquire-month-label"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Large Message Area */}
                            <div className="space-y-4 group">
                                <label htmlFor="enquire-message" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                    Anything we should know?
                                </label>
                                <textarea
                                    id="enquire-message"
                                    name="message"
                                    rows={4}
                                    value={formState.message}
                                    onChange={handleChange}
                                    className="w-full border-b border-black/10 py-4 text-lg font-light text-black bg-transparent rounded-none resize-none transition-all placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                                    placeholder="Interests, pace, dietary needs, a special occasion — anything that helps us plan."
                                />
                            </div>

                            {/* Badge only — this page is for questions, not for
                                redeeming codes, so no coupon field here. */}
                            <DiscountNotice email={formState.email} allowCoupon={false} />

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

                            <div className="flex justify-center">
                                <Turnstile
                                    onVerify={setTurnstileToken}
                                    onExpire={() => setTurnstileToken("")}
                                />
                            </div>

                            {/* Action Button */}
                            <div className="pt-12">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={SUBMIT_BUTTON}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-6">
                                        {isSubmitting ? "Sending..." : "Send my enquiry"}
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />}
                                    </span>
                                    <div aria-hidden className={SUBMIT_SWEEP} />
                                </button>
                            </div>

                            <div className="text-center">
                                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest leading-loose">
                                    A specialist replies within 24 business hours. <br />
                                    By submitting, you agree to our privacy policy.
                                </span>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>
        </div>
    );
}

