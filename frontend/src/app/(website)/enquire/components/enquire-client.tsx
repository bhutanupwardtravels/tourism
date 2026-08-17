"use client";

import Image from "next/image";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Turnstile } from "@/components/turnstile";
import { DiscountNotice } from "@/components/promo/discount-notice";
import { submitTourRequest } from "@/app/(portal)/plan-my-trip/actions";
import { FormInput } from "@/components/common/form-input";
import { CountryCodeSelect } from "@/components/common/country-code-select";
import { CountrySelect } from "@/components/common/country-select";
import { MonthSelect } from "@/components/common/month-select";
import { OptionSelect } from "@/components/common/option-select";
import { COUNTRIES } from "@/lib/countries";

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
    const [company, setCompany] = useState(""); // honeypot — hidden from real users
    // Advisory only: submitTourRequest re-validates the code server-side.
    const [couponCode, setCouponCode] = useState("");
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
        setIsSubmitting(true);

        const dialCode = COUNTRIES.find((c) => c.iso2 === phoneCountry)?.dialCode ?? "";

        const result = await submitTourRequest({
            ...formState,
            phone: `${dialCode} ${formState.phone}`.trim(),
            company,
            turnstileToken,
            couponCode: couponCode || undefined,
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full text-center space-y-12 relative z-10"
                >
                    <div className="w-24 h-24 border border-amber-600/30 rounded-full flex items-center justify-center mx-auto text-amber-600">
                        <Check className="w-10 h-10" />
                    </div>

                    <div className="space-y-4">
                        <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.6em] block font-bold">
                            // enquiry received
                        </span>
                        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tighter mb-12 uppercase drop-shadow-2xl">
Thank you \u2014 we've <span className="italic font-serif normal-case text-amber-600">got it</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light italic">
A travel specialist will email you within 24 business hours with a suggested itinerary and a full price. If it's urgent, call or WhatsApp us \u2014 the numbers are in the menu.
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
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-amber-100">
            {/* Immersive Hero Header */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                                        <Image
                        src="/images/cinematic/enquire-hero.png"
                        alt="Bhutan Luxury Planning"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <span className="font-mono text-amber-500 text-[10px] uppercase tracking-[0.8em] font-bold block mb-4">
                            // tailor your vision
                        </span>
                        <h1 className="text-6xl md:text-9xl font-light tracking-tighter text-white uppercase leading-none">
                            Begin Your <br />
                            <span className="italic font-serif normal-case text-amber-600">Odyssey</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 font-light italic max-w-2xl mx-auto leading-relaxed">
                            "Tell us the texture of your curiosity. Every journey we plan is a unique weave in the tapestry of the Kingdom of Bhutan."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-32 md:py-48 container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                    {/* Lateral Label Section */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-6">
                            <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.5em] font-bold block">
                                // enquiry details
                            </span>
                            <h2 className="text-4xl font-light tracking-tighter uppercase leading-tight text-black">
                                Personal <span className="italic font-serif normal-case text-amber-600">Discovery</span>
                            </h2>
                            <p className="text-black font-light leading-relaxed">
Tell us roughly when you want to travel and who's coming. We'll come back with a suggested itinerary and a full price, including the Sustainable Development Fee.
                            </p>
                        </div>

                        <div className="pt-12 border-t border-black/5 space-y-8">
                            <div className="flex items-start gap-6 group">
                                <span className="font-mono text-[10px] text-amber-600 pt-1 font-bold">[01]</span>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Response Time</h4>
                                    <p className="text-xs text-black font-medium">Within 24 business hours</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <span className="font-mono text-[10px] text-amber-600 pt-1 font-bold">[02]</span>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Tailored Planning</h4>
                                    <p className="text-xs text-black font-medium">Bespoke itineraries, zero templates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Form */}
                    <div className="lg:col-span-8">
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-16"
                        >
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
                                <div className="space-y-4 group md:col-span-2">
                                    <label id="enquire-phone-label" htmlFor="enquire-phone" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                        Phone
                                    </label>
                                    <div className="flex items-center gap-3 border-b border-black/10 focus-within:border-amber-600 transition-all">
                                        <CountryCodeSelect value={phoneCountry} onChange={setPhoneCountry} ariaLabelledBy="enquire-phone-label" />
                                        <input
                                            id="enquire-phone"
                                            type="tel"
                                            name="phone"
                                            required
                                            autoComplete="tel"
                                            value={formState.phone}
                                            onChange={handleChange}
                                            className="w-full py-4 text-lg font-light text-black bg-transparent rounded-none placeholder:text-gray-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                                            placeholder="17 123 456"
                                        />
                                    </div>
                                </div>
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
                                    placeholder="Interests, pace, dietary needs, a special occasion \u2014 anything that helps us plan."
                                />
                            </div>

                            <DiscountNotice email={formState.email} onCouponChange={setCouponCode} />

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
                                    className={cn(
                                        "group relative w-full overflow-hidden bg-black py-6 text-white text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-amber-600",
                                        isSubmitting && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-6">
                                        {isSubmitting ? "Sending..." : "Send my enquiry"}
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-500 transition-transform duration-700 ease-in-out" />
                                </button>
                            </div>

                            <div className="text-center">
                                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest leading-loose">
                                    A specialist replies within 24 business hours. <br />
                                    By submitting, you agree to our privacy policy.
                                </span>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </section>
        </div>
    );
}

