"use client";

import Image from "next/image";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Calendar, Loader2, Sparkles, Check, X, XCircle, Search, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Destination } from "@/app/(website)/destinations/schema";
import { Experience } from "@/app/(website)/experiences/schema";
import { Hotel } from "../../../admin/hotels/schema";
import { Cost } from "../../../admin/settings/schema";
import { DayItinerary, ItineraryItem } from "@/app/admin/tour-requests/types";
import { DayBuilder } from "./builder/day-builder";
import { ExperienceSelector } from "./builder/experience-selector";
import { TravelSelector } from "./builder/travel-selector";
import { HotelSelector } from "./builder/hotel-selector";
import { submitTourRequest, lookupTravellerDiscount, validateCoupon } from "../actions";
import { Turnstile } from "@/components/turnstile";
import { toast } from "sonner";
import { getTravelTime } from "@/constants/travel-times";
import { DestinationCard } from "@/components/common/destination-card";
import { CountryCodeSelect } from "@/components/common/country-code-select";
import { CountrySelect } from "@/components/common/country-select";
import { COUNTRIES } from "@/lib/countries";
import { buildQuote, computeFees, applyDiscount } from "@/lib/pricing/quote";

function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// YYYY-MM-DD in local time — matches <input type="date"> values, so it's safe
// to compare directly as strings without timezone drift from toISOString().
function formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Adds `days` to a YYYY-MM-DD string, built from its parts (not `new Date(str)`,
// which parses as UTC and can shift a calendar day in negative-offset timezones).
function addDaysToDateInput(dateStr: string, days: number): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + days);
    return formatDateInput(d);
}

interface CustomItineraryBuilderProps {
    experiences: Experience[];
    destinations: Destination[];
    allDestinations: Destination[];
    hotels: Hotel[];
    costs: Cost[];
    onBack: () => void;
}

type BuilderStep = "INFORMATION" | "ENTRY_POINT" | "BUILDER" | "SUCCESS";

export function CustomItineraryBuilder({
    experiences = [],
    destinations = [],
    allDestinations = [],
    hotels = [],
    costs = [],
    onBack
}: CustomItineraryBuilderProps) {
    const [step, setStep] = useState<BuilderStep>("INFORMATION");

    // Builder State
    const [days, setDays] = useState<DayItinerary[]>([
        { day: 1, items: [] } // Start with Day 1
    ]);
    const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
    const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
    const [showExperienceSelector, setShowExperienceSelector] = useState(false);
    const [showTravelSelector, setShowTravelSelector] = useState(false);
    const [showHotelSelector, setShowHotelSelector] = useState(false);
    const [showDestinationChangeGrid, setShowDestinationChangeGrid] = useState(false);
    const [destinationSearch, setDestinationSearch] = useState("");

    // Form State
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "", // ISO2 country code, e.g. "IN" — drives Indian-national pricing + analytics
        adults: 1,
        children_6_12: 0,
        children_under_6: 0,
        arrivalDate: "",
        departureDate: "",
        message: ""
    });
    const [phoneCountry, setPhoneCountry] = useState("BT");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");
    const [company, setCompany] = useState(""); // honeypot

    // Returning-traveller discount, resolved from the email on leaving the
    // INFORMATION step. Display only — the server recomputes it at submit.
    const [loyaltyPercent, setLoyaltyPercent] = useState(0);
    const [priorTrips, setPriorTrips] = useState(0);

    // Coupon from a lead-capture campaign.
    const [couponInput, setCouponInput] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponPercent, setCouponPercent] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

    // Earliest bookable date — trips must be arranged at least a week out.
    const minTripDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return formatDateInput(d);
    }, []);

    // Departure must be at least one day after arrival (no same-day trips).
    const minDepartureDate = useMemo(() => {
        if (!userDetails.arrivalDate) return minTripDate;
        const dayAfterArrival = addDaysToDateInput(userDetails.arrivalDate, 1);
        return dayAfterArrival > minTripDate ? dayAfterArrival : minTripDate;
    }, [userDetails.arrivalDate, minTripDate]);

    // --- Logic Helpers ---

    // The quote maths lives in @/lib/pricing/quote so this preview and the
    // authoritative figures computed in submitTourRequest can never drift.
    const quoteInput = {
        costs,
        country: userDetails.country,
        adults: userDetails.adults,
        children_6_12: userDetails.children_6_12,
        children_under_6: userDetails.children_under_6,
        arrivalDate: userDetails.arrivalDate,
        departureDate: userDetails.departureDate,
        customItinerary: days,
        experiences,
        hotels,
    };

    const calculateFees = () => computeFees(quoteInput);

    const calculateTotalCost = () => buildQuote(quoteInput).subtotal;

    // Best-of, never stacked — matches how the server resolves it at submit.
    const discountPercent = Math.max(loyaltyPercent, couponPercent);
    const discountKind: "none" | "loyalty" | "coupon" =
        discountPercent === 0 ? "none" : couponPercent >= loyaltyPercent ? "coupon" : "loyalty";
    const quoteSubtotal = calculateTotalCost();
    const discounted = applyDiscount(quoteSubtotal, discountPercent);

    // --- Builder Logic ---

    const addDay = () => {
        setDays([...days, { day: days.length + 1, items: [] }]);
    };

    const removeDay = (index: number) => {
        if (days.length <= 1) return;
        const newDays = days.filter((_, i) => i !== index)
            .map((day, i) => ({ ...day, day: i + 1 })); // Renumber
        setDays(newDays);
    };

    const addExperienceToDay = (dayIndex: number, experience: Experience) => {
        const newDays = [...days];
        const newItem: ItineraryItem = {
            id: generateId(),
            type: "experience",
            order: newDays[dayIndex].items.length,
            experienceId: experience._id || experience.slug,
            experience: {
                title: experience.title,
                duration: experience.duration || "2 Hours",
                image: experience.image
            }
        };
        newDays[dayIndex].items.push(newItem);
        setDays(newDays);
        setShowExperienceSelector(false);
    };

    const getDestinationAtPoint = (dayIndex: number, itemIndex?: number) => {
        // Search backwards from the specified point
        const allDests = allDestinations.length > 0 ? allDestinations : destinations;
        for (let i = dayIndex; i >= 0; i--) {
            const items = days[i].items;
            const startSearch = (i === dayIndex && itemIndex !== undefined) ? itemIndex - 1 : items.length - 1;

            for (let j = startSearch; j >= 0; j--) {
                const item = items[j];
                if (item.type === "travel" && item.travel?.to) {
                    return allDests.find(d => d.name === item.travel?.to) || null;
                }
            }
        }
        return activeDestination;
    };

    const addTravelBetweenDestinations = (dayIndex: number, toDest: Destination) => {
        const fromDest = getDestinationAtPoint(dayIndex) || activeDestination;
        const duration = fromDest ? getTravelTime(fromDest.name, toDest.name) : 0;

        const newDays = [...days];
        const newItem: ItineraryItem = {
            id: generateId(),
            type: "travel",
            order: newDays[dayIndex].items.length,
            destinationFromId: fromDest?._id || fromDest?.slug,
            destinationToId: toDest._id || toDest.slug,
            travel: {
                from: fromDest?.name || "Previous Location",
                to: toDest.name,
                duration: duration
            }
        };
        newDays[dayIndex].items.push(newItem);
        setDays(newDays);
        setActiveDestination(toDest);
        setShowDestinationChangeGrid(false);
    };

    const addHotelToDay = (dayIndex: number, hotel: any) => {
        const newDays = [...days];

        // Check if day already has a hotel
        const hasHotel = newDays[dayIndex].items.some(item => item.hotelId);
        if (hasHotel) {
            toast.error("Only one hotel per day allowed");
            return;
        }

        const newItem: ItineraryItem = {
            id: generateId(),
            type: "travel", // Mixed type but with hotelId
            order: newDays[dayIndex].items.length,
            hotelId: hotel._id || hotel.slug,
            hotel: {
                name: hotel.name,
                image: hotel.image
            }
        };
        newDays[dayIndex].items.push(newItem);
        setDays(newDays);
        setShowHotelSelector(false);

        // Auto-create next day if this is the last day
        if (dayIndex === days.length - 1) {
            setDays(prev => [...prev, {
                day: prev.length + 1,
                items: []
            }]);
        }
    };

    const removeItemFromDay = (dayIndex: number, itemId: string) => {
        const newDays = [...days];
        newDays[dayIndex].items = newDays[dayIndex].items.filter(item => item.id !== itemId);
        setDays(newDays);
    };

    const reorderItemsInDay = (dayIndex: number, items: ItineraryItem[]) => {
        const newDays = [...days];
        newDays[dayIndex].items = items;
        setDays(newDays);
    };

    const calculateDayHours = (items: ItineraryItem[]) => {
        return items.reduce((total, item) => {
            if (item.type === "travel") return total + (item.travel?.duration || 0);
            if (item.type === "experience") {
                // Parse duration string "X Hours" or similar
                const durationStr = item.experience?.duration || "";
                const match = durationStr.match(/(\d+(\.\d+)?)/);
                return total + (match ? parseFloat(match[0]) : 2); // Default 2 hours
            }
            return total;
        }, 0);
    };

    const validateItinerary = () => {
        for (const day of days) {
            if (day.items.length === 0) return { valid: false, message: `Day ${day.day} is empty.` };
            if (calculateDayHours(day.items) > 18) return { valid: false, message: `Day ${day.day} exceeds 18 hours limit.` };
        }
        return { valid: true };
    };

    // --- Submission Logic ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dialCode = COUNTRIES.find((c) => c.iso2 === phoneCountry)?.dialCode ?? "";

        const payload = {
            ...userDetails,
            phone: `${dialCode} ${userDetails.phone}`.trim(),
            company, // honeypot
            turnstileToken,
            tourName: "Custom Bespoke Itinerary",
            status: "pending",
            travelDate: "Custom Dates", // Or add field
            customItinerary: days,
            // Advisory: the server re-validates the code and recomputes the
            // discount and total from its own data before storing anything.
            couponCode: couponCode || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await submitTourRequest(payload);

        if (result.success) {
            setStep("SUCCESS");
        } else {
            toast.error(result.error || "Failed to submit request.");
        }
        setIsSubmitting(false);
    };

    // Resolved from the email once the traveller leaves the INFORMATION step.
    // Display only — submitTourRequest recounts it server-side at submit.
    const refreshLoyalty = async (email: string) => {
        try {
            const result = await lookupTravellerDiscount(email);
            setLoyaltyPercent(result.percent);
            setPriorTrips(result.priorTrips);
        } catch {
            setLoyaltyPercent(0);
            setPriorTrips(0);
        }
    };

    const handleApplyCoupon = async () => {
        const code = couponInput.trim().toUpperCase();
        if (!code) return;

        setIsCheckingCoupon(true);
        setCouponError("");
        try {
            const result = await validateCoupon(code, userDetails.email);
            if (result.valid) {
                setCouponCode(result.code);
                setCouponPercent(result.percent);
            } else {
                setCouponError(result.reason);
            }
        } catch {
            setCouponError("We couldn't verify that code. Please try again.");
        }
        setIsCheckingCoupon(false);
    };

    if (step === "SUCCESS") {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center py-24 space-y-8">
                <div className="w-24 h-24 border border-green-600/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-light uppercase tracking-tight text-black">Itinerary <span className="italic normal-case text-amber-600">Submitted</span></h2>
                <p className="text-gray-500">Our team will review your bespoke design and contact you shortly.</p>
                <button
                    onClick={() => window.location.href = "/"}
                    className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-amber-600 transition-colors"
                >
                    Return Home
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full container mx-auto pb-24"
        >
            {/* Header */}
            <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-8">
                <div className="space-y-4">
                    <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.5em] font-bold block">
                        // bespoke architecture
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-none text-black">
                        Planner <span className="italic font-serif normal-case text-amber-600">Studio</span>
                    </h2>
                </div>
                <div className="flex gap-4">
                    {step !== "INFORMATION" && (
                        <button
                            onClick={() => {
                                if (step === "ENTRY_POINT") setStep("INFORMATION");
                                if (step === "BUILDER") setStep("ENTRY_POINT");
                            }}
                            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                    <button onClick={onBack} className="text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                        Exit Studio
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === "INFORMATION" ? (
                    <motion.div
                        key="information"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-3xl mx-auto space-y-12"
                    >
                        <div className="bg-amber-50/50 p-8 rounded-xs border border-amber-100 mb-8">
                            <div className="flex items-center gap-4 text-amber-900 mb-4">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Bespoke Information Gathering</h3>
                            </div>
                            <p className="text-sm text-amber-800/80 leading-relaxed font-light italic serif">
                                To architect the most resonant journey and provide accurate estimations, we require the specific frequency of your delegation.
                            </p>
                        </div>

                        <div className="space-y-16">
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <FormInput
                                    label="Given Name"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={userDetails.firstName}
                                    onChange={(e: any) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                                />
                                <FormInput
                                    label="Family Name"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={userDetails.lastName}
                                    onChange={(e: any) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                                />
                                <FormInput
                                    label="Digital Address"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={userDetails.email}
                                    onChange={(e: any) => setUserDetails({ ...userDetails, email: e.target.value })}
                                />
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                        Country
                                    </label>
                                    <div className="border-b border-black/10 focus-within:border-amber-600 transition-all">
                                        <CountrySelect
                                            value={userDetails.country}
                                            onChange={(iso2) => {
                                                setUserDetails({ ...userDetails, country: iso2 });
                                                // Default the phone code to match — still independently editable below.
                                                setPhoneCountry(iso2);
                                            }}
                                            placeholder="Select your country"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors">
                                        Mobile Connection
                                    </label>
                                    <div className="flex items-center gap-3 border-b border-black/10 focus-within:border-amber-600 transition-all">
                                        <CountryCodeSelect value={phoneCountry} onChange={setPhoneCountry} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={userDetails.phone}
                                            onChange={(e: any) => setUserDetails({ ...userDetails, phone: e.target.value })}
                                            className="w-full py-4 text-lg font-light text-black focus:outline-none bg-transparent rounded-none placeholder:text-gray-200"
                                            placeholder="17 123 456"
                                        />
                                    </div>
                                </div>
                                <FormInput
                                    label="Arrival Date"
                                    name="arrivalDate"
                                    type="date"
                                    min={minTripDate}
                                    value={userDetails.arrivalDate}
                                    onChange={(e: any) => setUserDetails({ ...userDetails, arrivalDate: e.target.value })}
                                />
                                <FormInput
                                    label="Departure Date"
                                    name="departureDate"
                                    type="date"
                                    min={minDepartureDate}
                                    value={userDetails.departureDate}
                                    onChange={(e: any) => setUserDetails({ ...userDetails, departureDate: e.target.value })}
                                />
                            </div>

                            {/* Travelers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 bg-neutral-50 p-8 roundedxs border border-neutral-100">
                                <FormInput
                                    label="Adults (12+)"
                                    name="adults"
                                    type="number"
                                    min={1}
                                    value={userDetails.adults}
                                    onChange={(e: any) => {
                                        const parsed = parseInt(e.target.value);
                                        setUserDetails({ ...userDetails, adults: Number.isNaN(parsed) ? 1 : Math.max(1, parsed) });
                                    }}
                                />
                                <FormInput
                                    label="Children (6-12)"
                                    name="children_6_12"
                                    type="number"
                                    min={0}
                                    value={userDetails.children_6_12}
                                    onChange={(e: any) => {
                                        const parsed = parseInt(e.target.value);
                                        setUserDetails({ ...userDetails, children_6_12: Number.isNaN(parsed) ? 0 : Math.max(0, parsed) });
                                    }}
                                />
                                <FormInput
                                    label="Infants (< 6)"
                                    name="children_under_6"
                                    type="number"
                                    min={0}
                                    value={userDetails.children_under_6}
                                    onChange={(e: any) => {
                                        const parsed = parseInt(e.target.value);
                                        setUserDetails({ ...userDetails, children_under_6: Number.isNaN(parsed) ? 0 : Math.max(0, parsed) });
                                    }}
                                />
                            </div>

                            {/* Narrative */}
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black group-focus-within:text-amber-600 transition-colors font-mono">
                                    // Narrative & Special Requirements
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={userDetails.message}
                                    onChange={e => setUserDetails({ ...userDetails, message: e.target.value })}
                                    className="w-full text-black border-b border-black/10 py-4 text-lg font-light focus:outline-none focus:border-amber-600 transition-all bg-transparent rounded-none resize-none placeholder:text-gray-300 italic serif"
                                    placeholder="Any dietary restrictions, physical limitations, or special occasions?"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    if (!userDetails.firstName || !userDetails.lastName || !userDetails.email || !userDetails.phone || !userDetails.arrivalDate || !userDetails.departureDate) {
                                        toast.error("Please fill in all required fields.");
                                        return;
                                    }
                                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
                                        toast.error("Please enter a valid email address.");
                                        return;
                                    }
                                    if (userDetails.arrivalDate < minTripDate || userDetails.departureDate < minTripDate) {
                                        toast.error("Arrival and departure dates must be at least a week from today.");
                                        return;
                                    }
                                    if (userDetails.departureDate <= userDetails.arrivalDate) {
                                        toast.error("Departure date must be at least one day after the arrival date.");
                                        return;
                                    }
                                    // Fire-and-forget: the badge appearing a
                                    // moment later is fine, and a slow lookup
                                    // must never hold up the builder.
                                    refreshLoyalty(userDetails.email);
                                    setStep("ENTRY_POINT");
                                }}
                                className="group relative w-full overflow-hidden bg-black py-8 text-white text-[10px] font-bold uppercase tracking-[0.5em] transition-all hover:bg-amber-600"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                    Continue to Entry Point <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                                </span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-500 transition-transform duration-700 ease-in-out" />
                            </button>
                        </div>
                    </motion.div>
                ) : step === "ENTRY_POINT" ? (
                    <motion.div
                        key="entry-point"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                        <div className="text-center space-y-4 mb-12">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600 font-mono">// spatial initialization</span>
                            <h3 className="text-4xl font-light uppercase tracking-tight text-black">Select Your <span className="italic normal-case text-amber-600">Entry Point</span></h3>
                            <p className="text-gray-500 max-w-xl mx-auto font-light">Your choice of entry determines the initial coordinates of your Bhutanese narrative.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {destinations.map((dest, index) => (
                                <DestinationCard
                                    key={dest._id}
                                    destination={dest}
                                    index={index}
                                    disableLink
                                    onClick={() => {
                                        const entryItem: ItineraryItem = {
                                            id: generateId(),
                                            type: "travel",
                                            order: 0,
                                            destinationToId: dest._id || dest.slug,
                                            travel: {
                                                from: "Entry Point",
                                                to: dest.name,
                                                duration: 0
                                            }
                                        };
                                        setDays([{ day: 1, items: [entryItem] }]);
                                        setActiveDestination(dest);
                                        setStep("BUILDER");
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : step === "BUILDER" ? (
                    <motion.div
                        key="builder"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                    >
                        {/* Sidebar: Cost Summary */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-24 space-y-8">
                                <Link
                                    href="/enquire"
                                    className="w-full bg-white border border-gray-200 py-6 px-6 rounded-xs flex items-center justify-between group hover:border-amber-500 transition-colors shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                            <Headphones className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-amber-600 transition-colors block">Need Assistance?</span>
                                            <span className="text-sm font-bold uppercase tracking-wide text-black mt-1 block">Get Help Planning</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-600 transition-colors" />
                                </Link>

                                <div className="bg-black text-white p-8 rounded-xs shadow-2xl">
                                    <div className="flex items-center gap-3 mb-8 text-amber-500">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Estimated Investment</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                            <span className="text-white/60 text-xs uppercase tracking-widest font-mono">// Total Estimate</span>
                                            <span className="text-4xl font-light tracking-tighter text-amber-500">
                                                ${discounted.total.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {calculateFees().breakdown.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-xs">
                                                    <span className="text-white/40">{item.label}</span>
                                                    <span className="text-white/80">${item.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between text-xs pt-4 border-t border-white/5">
                                                <span className="text-white/40">Activities & Hotels</span>
                                                <span className="text-white/80">${(quoteSubtotal - calculateFees().total).toLocaleString()}</span>
                                            </div>
                                            {discountPercent > 0 && (
                                                <>
                                                    <div className="flex justify-between text-xs pt-4 border-t border-white/5">
                                                        <span className="text-white/40">Subtotal</span>
                                                        <span className="text-white/80">${quoteSubtotal.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-amber-500/80">
                                                            {discountKind === "coupon"
                                                                ? `Coupon ${couponCode}`
                                                                : `Returning traveller (${priorTrips} ${priorTrips === 1 ? "trip" : "trips"})`}
                                                            {" "}&mdash; {discountPercent}%
                                                        </span>
                                                        <span className="text-amber-500">-${discounted.discountAmount.toLocaleString()}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Coupon redemption */}
                                        <div className="pt-4 border-t border-white/10 space-y-3">
                                            {couponPercent > 0 ? (
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-xs text-amber-500 font-mono tracking-wide">
                                                        {couponCode} applied &mdash; {couponPercent}% off
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCouponCode("");
                                                            setCouponPercent(0);
                                                            setCouponInput("");
                                                            setCouponError("");
                                                        }}
                                                        className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">
                                                        Discount code
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponInput}
                                                            onChange={(e) => {
                                                                setCouponInput(e.target.value.toUpperCase());
                                                                setCouponError("");
                                                            }}
                                                            placeholder="BHU-XXXXXX"
                                                            className="flex-1 bg-transparent border border-white/20 px-3 py-2 text-xs font-mono tracking-wider text-white placeholder:text-white/20 focus:border-amber-500 focus:outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleApplyCoupon}
                                                            disabled={isCheckingCoupon || !couponInput.trim()}
                                                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-white/10 transition-colors"
                                                        >
                                                            {isCheckingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                                                        </button>
                                                    </div>
                                                    {couponError && (
                                                        <p className="text-[11px] text-rose-400">{couponError}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

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

                                    <div className="mt-8 flex justify-center">
                                        <Turnstile
                                            onVerify={setTurnstileToken}
                                            onExpire={() => setTurnstileToken("")}
                                        />
                                    </div>

                                    <button
                                        onClick={async () => {
                                            const validation = validateItinerary();
                                            if (validation.valid) {
                                                await handleSubmit(new Event('submit') as any);
                                            } else {
                                                toast.error(validation.message);
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className="w-full mt-12 bg-amber-600 hover:bg-amber-500 py-6 text-[10px] font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Request"}
                                        {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="bg-neutral-50 p-6 rounded border border-neutral-100 italic serif text-sm text-gray-500 leading-relaxed">
                                    "This estimation includes SDF, accommodation, and curated experiences. Final pricing may vary based on specific hotel availability and seasonality."
                                </div>
                            </div>
                        </div>

                        {/* Main Builder Area */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Destination Header */}
                            <div className="flex items-center justify-between p-8 bg-white border border-neutral-100 rounded-xs shadow-sm">
                                <div className="flex items-center gap-6">
                                    {activeDestination?.image && (
                                        <Image
                                            src={activeDestination.image}
                                            alt={activeDestination.name}
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/20"
                                        />
                                    )}
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-mono">// active coordinates</span>
                                        <h4 className="text-2xl font-light uppercase tracking-tight text-black">{activeDestination?.name}</h4>
                                    </div>
                                </div>
                            </div>

                            {/* Days Timeline */}
                            <div className="space-y-8">
                                {days.map((day, index) => (
                                    <div key={day.day} className="relative group">
                                        <DayBuilder
                                            day={day}
                                            totalHours={calculateDayHours(day.items)}
                                            isValid={calculateDayHours(day.items) <= 18}
                                            hasHotel={day.items.some(item => !!item.hotelId)}
                                            onAddExperience={() => {
                                                setActiveDayIndex(index);
                                                setShowExperienceSelector(true);
                                            }}
                                            onAddTravel={() => {
                                                setActiveDayIndex(index);
                                                setShowDestinationChangeGrid(true);
                                            }}
                                            onAddHotel={() => {
                                                setActiveDayIndex(index);
                                                setShowHotelSelector(true);
                                            }}
                                            onRemoveItem={(itemId) => removeItemFromDay(index, itemId)}
                                            onReorder={(items) => reorderItemsInDay(index, items)}
                                        />
                                        {days.length > 1 && (
                                            <button
                                                onClick={() => removeDay(index)}
                                                className="absolute -right-6 top-8 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Remove Day"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addDay}
                                className="w-full py-12 border-2 border-dashed border-neutral-200 rounded-xs text-neutral-400 hover:text-black hover:border-black transition-all flex flex-col items-center gap-4 group"
                            >
                                <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Expand Chronology (Day {days.length + 1})</span>
                            </button>
                        </div>
                    </motion.div>
                ) : step === "SUCCESS" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto text-center py-24 space-y-8"
                    >
                        <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <h3 className="text-4xl font-light uppercase tracking-tight">Narrative Initialized</h3>
                        <p className="text-gray-500 italic serif">
                            A travel consultant will review your bespoke architecture and reach out via your digital address within 24 hours to finalize the frequency.
                        </p>
                        <button
                            onClick={onBack}
                            className="bg-black text-white px-12 py-5 rounded-sm uppercase tracking-[0.2em] text-xs font-bold hover:bg-amber-600 transition-colors shadow-xl mt-8"
                        >
                            Return to Collections
                        </button>
                    </motion.div>
                ) : null
                }
            </AnimatePresence >

            {/* Destination Change Grid Modal */}
            <AnimatePresence>
                {
                    showDestinationChangeGrid && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={() => setShowDestinationChangeGrid(false)}>
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-neutral-50 w-full max-w-7xl max-h-[90vh] rounded-xs overflow-hidden shadow-2xl flex flex-col"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 block mb-2">
                                            // navigation
                                        </span>
                                        <h2 className="text-black text-3xl font-light tracking-tight uppercase">Select Next Coordinate</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowDestinationChangeGrid(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search destinations..."
                                            value={destinationSearch}
                                            onChange={(e) => setDestinationSearch(e.target.value)}
                                            className="w-full text-black bg-gray-50 border border-gray-200 rounded-xs pl-12 pr-4 py-3 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(allDestinations.length > 0 ? allDestinations : destinations)
                                            .filter(d => d._id !== activeDestination?._id)
                                            .filter(d => d.name.toLowerCase().includes(destinationSearch.toLowerCase()))
                                            .map((dest, index) => (
                                                <DestinationCard
                                                    key={dest._id}
                                                    destination={dest}
                                                    index={index}
                                                    disableLink
                                                    onClick={() => addTravelBetweenDestinations(activeDayIndex ?? days.length - 1, dest)}
                                                />
                                            ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >

            {/* Modals with enhanced filtering */}
            <AnimatePresence>
                {
                    showExperienceSelector && (
                        <ExperienceSelector
                            onClose={() => setShowExperienceSelector(false)}
                            onSelect={(exp) => activeDayIndex !== null && addExperienceToDay(activeDayIndex, exp)}
                            experiences={experiences.filter(e => {
                                const contextDest = activeDayIndex !== null ? getDestinationAtPoint(activeDayIndex) : activeDestination;
                                return !contextDest ||
                                    e.destinationSlug === contextDest.slug ||
                                    (e.destinations && e.destinations.includes(contextDest._id!));
                            })}
                        />
                    )
                }
                {
                    showHotelSelector && (
                        <HotelSelector
                            hotels={hotels.filter(h => {
                                const contextDest = activeDayIndex !== null ? getDestinationAtPoint(activeDayIndex) : activeDestination;
                                return !contextDest ||
                                    h.destination === contextDest._id ||
                                    h.destinationId === contextDest._id ||
                                    h.destinationSlug === contextDest.slug;
                            })}
                            onSelect={(hotel) => activeDayIndex !== null && addHotelToDay(activeDayIndex, hotel)}
                            onClose={() => setShowHotelSelector(false)}
                        />
                    )
                }
            </AnimatePresence >
        </motion.div >
    );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text", ...rest }: any) {
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
                {...rest}
            />
        </div>
    );
}
