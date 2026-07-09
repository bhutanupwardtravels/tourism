"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitTourRequest } from "../actions";
import { Tour } from "../../tours/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

        const payload = {
            ...formState,
            tourId: selectedTour ? selectedTour._id : undefined,
            tourName: selectedTour ? selectedTour.title : undefined,
        };

        const result = await submitTourRequest(payload);

        if (result.success) {
            setIsSubmitted(true);
        } else {
            console.error("Failed to submit");
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
                        // request received
                    </span>
                    <h1 className="text-5xl font-light tracking-tighter uppercase text-black">
                        Request <span className="italic font-serif normal-case text-amber-600">Confirmed</span>
                    </h1>
                    <p className="text-black leading-relaxed text-xl font-light italic max-w-lg mx-auto">
                        "Your request for {selectedTour?.title} has been received. Our team will review your application and respond shortly."
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
                    <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.5em] font-bold block">
                        // finalization
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="relative aspect-4/5 overflow-hidden rounded-xs group">
                        <img
                            src={selectedTour?.image}
                            alt={selectedTour?.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="inline-block bg-amber-600/90 backdrop-blur-sm px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-widest text-white">
                                    // Selected Archetype
                                </span>
                            </div>

                            <div>
                                <h3 className="text-3xl font-light uppercase tracking-tight text-white mb-2 leading-none">
                                    {selectedTour?.title}
                                </h3>
                                <p className="text-white/60 text-sm font-light italic mb-6 line-clamp-2">
                                    "{selectedTour?.description}"
                                </p>
                                <div className="border-t border-white/20 pt-6 flex justify-between items-end">
                                    <div>
                                        <span className="block text-[8px] uppercase tracking-widest text-white/50 mb-1">Investment</span>
                                        <p className="font-mono text-lg text-amber-500">{selectedTour?.price}</p>
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
                                <Select
                                    name="travelers"
                                    value={formState.travelers}
                                    onValueChange={(value) => setFormState({ ...formState, travelers: value })}
                                >
                                    <SelectTrigger className="flex w-full h-auto min-h-[60px] items-center justify-between text-black border-0 border-b border-black/10 py-4 text-lg font-light focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none px-0 shadow-none ring-0 focus:ring-0">
                                        <SelectValue placeholder="Select volume" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Solitary [1]</SelectItem>
                                        <SelectItem value="2">Duo [2]</SelectItem>
                                        <SelectItem value="3-4">Small Group [3-4]</SelectItem>
                                        <SelectItem value="5-8">Large Group [5-8]</SelectItem>
                                        <SelectItem value="9+">Kingdom Delegation [9+]</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                className="w-full text-black border-b border-black/10 py-4 text-lg font-light focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none resize-none placeholder:text-gray-300 italic serif"
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
                                <span className="text-xs relative z-10 flex items-center justify-center gap-6">
                                    {isSubmitting ? "Initiating Transmission..." : "Submit Application"}
                                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />}
                                </span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-500 transition-transform duration-700 ease-in-out" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-4 group">
            <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 group-focus-within:text-amber-600 transition-colors">
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
