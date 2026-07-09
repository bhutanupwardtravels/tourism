"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnquirePage() {
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        destination: "Bhutan",
        travelDate: "",
        travelers: "",
        message: "",
    });

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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">
                {/* Background Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img
                        src="/images/cinematic/enquire-hero.png"
                        className="w-full h-full object-cover filter grayscale"
                        alt=""
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
                            // journey initiated
                        </span>
                        <h1 className="text-6xl md:text-9xl font-light text-white tracking-tighter mb-12 uppercase mix-blend-overlay opacity-90 drop-shadow-2xl">
                            Your <span className="italic font-serif normal-case text-amber-600">Sanctuary</span> awaits
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light italic">
                            "The path to the Kingdom is now being prepared for you. Our specialists will reach out to weave your story shortly."
                        </p>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => window.location.href = "/"}
                            className="group inline-flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all"
                        >
                            Return to Exploration <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Meta Footer */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                    <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em] leading-loose">
                        Ref: ACK-2025 // BHUTAN <br />
                        Auth: Kingdom Concierge
                    </div>
                    <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em] text-right">
                        Status: Confirmed <br />
                        T: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-amber-100">
            {/* Immersive Hero Header */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/cinematic/enquire-hero.png"
                        className="w-full h-full object-cover"
                        alt="Bhutan Luxury Planning"
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
                                Our bespoke journey design begins with a conversation. Please share your preferences so we can pair you with the right specialist.
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
                                    label="Given Name"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formState.firstName}
                                    onChange={handleChange}
                                />
                                <FormInput
                                    label="Family Name"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formState.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Contact Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                <FormInput
                                    label="Digital Address"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formState.email}
                                    onChange={handleChange}
                                />
                                <FormInput
                                    label="Mobile Connection"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={formState.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Travel Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                        Traveler Count
                                    </label>
                                    <div className="relative border-b border-black/10 group-focus-within:border-amber-600 transition-all">
                                        <select
                                            name="travelers"
                                            value={formState.travelers}
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-4 text-lg font-light text-black focus:outline-none appearance-none cursor-pointer placeholder:text-gray-300"
                                        >
                                            <option value="">Select volume</option>
                                            <option value="1">Solitary [1]</option>
                                            <option value="2">Duo [2]</option>
                                            <option value="3-4">Small Group [3-4]</option>
                                            <option value="5-8">Large Group [5-8]</option>
                                            <option value="9+">Kingdom Delegation [9+]</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none group-focus-within:text-amber-600" />
                                    </div>
                                </div>

                                <FormInput
                                    label="Anticipated Arrival"
                                    name="travelDate"
                                    placeholder="e.g., Autumn 2025"
                                    value={formState.travelDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Large Message Area */}
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors font-mono">
                                    // Narrative & Requirements
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formState.message}
                                    onChange={handleChange}
                                    className="w-full border-b border-black/10 py-4 text-lg font-light text-black focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none resize-none placeholder:text-gray-300 italic serif"
                                    placeholder="Describe your vision, interests, or any special moments you wish to experience..."
                                />
                            </div>

                            {/* Action Button */}
                            <div className="pt-12">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "group relative w-full overflow-hidden bg-black py-8 text-white text-[10px] font-bold uppercase tracking-[0.5em] transition-all hover:bg-amber-600",
                                        isSubmitting && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-6">
                                        {isSubmitting ? "Initiating Transmission..." : "Initiate Your Journey"}
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-500 transition-transform duration-700 ease-in-out" />
                                </button>
                            </div>

                            <div className="text-center">
                                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest leading-loose">
                                    Bhutan Kingdom Tourism // Private Exploration Auth <br />
                                    By submitting, you agree to our bespoke processing terms.
                                </span>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-4 group">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                {label}
            </label>
            <input
                type={type}
                name={name}
                required
                value={value}
                onChange={onChange}
                className="w-full border-b border-black/10 py-4 text-lg font-light text-black focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none placeholder:text-gray-200"
                placeholder={placeholder}
            />
        </div>
    );
}
