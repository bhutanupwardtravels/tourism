"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Loader2, Plus, X, Search, MapPin, Star, BedDouble,
    ArrowRightLeft, Clock, AlertCircle, ChevronUp, ChevronDown, Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedArrowLeft } from "@/components/ui/animated-arrow-left";
import type { AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { tourSchema, Tour } from "../schema";
import {
    getCategoriesForDropdown,
    getExperiencesForDropdown,
    getHotelsForDropdown,
    getAllDestinationObjects,
    getEntryPointDestinationObjects,
} from "../actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { generateSlug } from "@/utils/slug-generator";
import { Combobox } from "./combobox-wrapper";
import { MultiSelect } from "@/components/ui/multi-select";
import { Cost } from "../../settings/schema";
import { getTravelTime } from "@/constants/travel-times";

// ─── Local types ────────────────────────────────────────────────────────────

interface DestinationObj {
    _id: string;
    name: string;
    image?: string;
    slug?: string;
}

interface ExperienceObj {
    value: string;
    label: string;
    price?: number;
    duration?: string;
    image?: string;
    destinationIds?: string[];
    destinationSlug?: string;
}

interface HotelObj {
    value: string;
    label: string;
    price?: number;
    image?: string;
    destinationId?: string;
    destinationSlug?: string;
}

interface BuilderItem {
    id: string;
    type: "experience" | "travel";
    order: number;
    experienceId?: string;
    experience?: { title: string; duration: string; image?: string };
    hotelId?: string;
    hotel?: { name: string; image?: string };
    destinationFromId?: string;
    destinationToId?: string;
    travel?: { from: string; to: string; duration: number };
}

interface BuilderDay {
    day: number;
    title: string;
    description: string;
    image?: string;
    items: BuilderItem[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

function calculateDayHours(items: BuilderItem[]): number {
    return items.reduce((total, item) => {
        if (item.hotelId) return total; // overnight stays don't count
        if (item.type === "travel" && item.travel) return total + (item.travel.duration || 0);
        if (item.type === "experience") {
            const match = (item.experience?.duration || "").match(/(\d+(\.\d+)?)/);
            return total + (match ? parseFloat(match[0]) : 2);
        }
        return total;
    }, 0);
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface TourFormProps {
    initialData?: Tour;
    action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
    allCosts?: Cost[];
}

// ─── TourForm ────────────────────────────────────────────────────────────────

export function TourForm({ initialData, action, title: pageTitle, allCosts = [] }: TourFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [dayFiles, setDayFiles] = React.useState<{ [key: number]: File }>({});
    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    // ── Options ──────────────────────────────────────────────────────────────
    const [categoryOptions, setCategoryOptions] = React.useState<{ value: string; label: string }[]>([]);
    const [experienceOptions, setExperienceOptions] = React.useState<ExperienceObj[]>([]);
    const [hotelOptions, setHotelOptions] = React.useState<HotelObj[]>([]);
    const [destinationObjects, setDestinationObjects] = React.useState<DestinationObj[]>([]); // all destinations for "Move to"
    const [entryPointDestinations, setEntryPointDestinations] = React.useState<DestinationObj[]>([]); // isEntryPoint only
    const [isLoadingOptions, setIsLoadingOptions] = React.useState(true);

    // ── Builder state ────────────────────────────────────────────────────────
    const [days, setDays] = React.useState<BuilderDay[]>([]);
    const [activeDestination, setActiveDestination] = React.useState<DestinationObj | null>(null);
    const [entryPointSelected, setEntryPointSelected] = React.useState(false);

    // Modal state
    const [activeDayIndex, setActiveDayIndex] = React.useState<number | null>(null);
    const [showDestModal, setShowDestModal] = React.useState(false);
    const [showExpModal, setShowExpModal] = React.useState(false);
    const [showHotelModal, setShowHotelModal] = React.useState(false);
    const [destSearch, setDestSearch] = React.useState("");
    const [expSearch, setExpSearch] = React.useState("");
    const [hotelSearch, setHotelSearch] = React.useState("");

    // entry-point search (grid search)
    const [entrySearch, setEntrySearch] = React.useState("");

    // track edit init
    const initDone = React.useRef(false);

    // ── React-hook-form (static fields only) ─────────────────────────────────
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Tour>({
        resolver: zodResolver(tourSchema) as any,
        defaultValues: initialData ? {
            ...initialData,
            price: Number(initialData.price),
            priority: initialData.priority ?? 0,
            category: initialData.category ?? "",
            highlights: initialData.highlights ?? [],
            days: [],
            selectedCostIds: initialData.selectedCostIds ?? [],
            duration: initialData.duration ?? "",
        } : {
            title: "",
            slug: "",
            description: "",
            image: "",
            duration: "",
            price: 0,
            priority: 0,
            category: "",
            highlights: [],
            days: [],
            selectedCostIds: [],
        },
    });

    const watchedTitle = watch("title");
    const watchedSelectedCostIds = watch("selectedCostIds") || [];

    // ── Auto-slug ────────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (watchedTitle) setValue("slug", generateSlug(watchedTitle));
    }, [watchedTitle, setValue]);

    // ── Auto-duration ────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (days.length > 0) {
            const nights = Math.max(0, days.length - 1);
            setValue("duration", `${days.length} Days / ${nights} Nights`);
        } else {
            setValue("duration", "");
        }
    }, [days.length, setValue]);

    // ── Load options ─────────────────────────────────────────────────────────
    React.useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [categories, experiences, hotels, allDests, entryDests] = await Promise.all([
                    getCategoriesForDropdown(),
                    getExperiencesForDropdown(),
                    getHotelsForDropdown(),
                    getAllDestinationObjects(),
                    getEntryPointDestinationObjects(),
                ]);
                setCategoryOptions(categories);
                setExperienceOptions(experiences as ExperienceObj[]);
                setHotelOptions(hotels as HotelObj[]);
                setDestinationObjects(allDests);
                setEntryPointDestinations(entryDests);
            } catch {
                toast.error("Failed to fetch options");
            } finally {
                setIsLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    // ── Init builder from initialData (edit mode) ────────────────────────────
    React.useEffect(() => {
        if (initDone.current) return;
        if (!initialData?.days?.length || isLoadingOptions) return;

        initDone.current = true;

        const loadedDays: BuilderDay[] = initialData.days.map((day: any) => {
            const items: BuilderItem[] = (day.items || []).map((item: any) => ({
                id: item.id || generateId(),
                type: item.type,
                order: item.order ?? 0,
                experienceId: item.experienceId,
                experience: item.experience,
                hotelId: item.hotelId,
                hotel: item.hotel,
                destinationFromId: item.destinationFromId,
                destinationToId: item.destinationToId,
                travel: item.travel,
            }));

            // Convert legacy day.hotelId field → hotel item
            if (day.hotelId && !items.some((i: BuilderItem) => i.hotelId)) {
                const hotelOpt = hotelOptions.find(h => h.value === day.hotelId);
                items.push({
                    id: generateId(),
                    type: "travel",
                    order: items.length,
                    hotelId: day.hotelId,
                    hotel: { name: hotelOpt?.label || "Hotel" },
                });
            }

            return {
                day: day.day,
                title: day.title || `Day ${day.day}`,
                description: day.description || "",
                image: day.image,
                items,
            };
        });

        setDays(loadedDays);
        setEntryPointSelected(true);

        // Determine active destination from the last travel-to item
        let foundDest: DestinationObj | null = null;
        outer: for (const day of loadedDays) {
            for (const item of day.items) {
                if (item.type === "travel" && item.travel?.to && !item.hotelId) {
                    const dest = destinationObjects.find(
                        d => d.name === item.travel?.to || d._id === item.destinationToId
                    );
                    if (dest) { foundDest = dest; break outer; }
                }
            }
        }
        if (foundDest) setActiveDestination(foundDest);
    }, [initialData, isLoadingOptions, destinationObjects]);

    // ── Price calculation ────────────────────────────────────────────────────
    const calculateTotal = React.useCallback(() => {
        const currentCostIds = watch("selectedCostIds") || [];
        let total = 0;
        currentCostIds.forEach((id: string) => {
            const cost = allCosts.find(c => c.id === id || c._id === id);
            if (cost) total += cost.type === "daily" ? (Number(cost.price) || 0) * days.length : (Number(cost.price) || 0);
        });
        days.forEach(day => {
            day.items.forEach(item => {
                if (item.experienceId) {
                    const exp = experienceOptions.find(e => e.value === item.experienceId);
                    if (exp?.price) total += Number(exp.price) || 0;
                }
                if (item.hotelId) {
                    const hotel = hotelOptions.find(h => h.value === item.hotelId);
                    if (hotel?.price) total += Number(hotel.price) || 0;
                }
            });
        });
        return total;
    }, [days, watch, hotelOptions, experienceOptions, allCosts]);

    // Sync price when days or cost selection changes
    React.useEffect(() => {
        setValue("price", calculateTotal());
    }, [days, watchedSelectedCostIds, calculateTotal, setValue]);

    // ── Builder helpers ───────────────────────────────────────────────────────

    const getContextDestination = (dayIndex: number): DestinationObj | null => {
        for (let i = dayIndex; i >= 0; i--) {
            const items = days[i]?.items || [];
            for (let j = items.length - 1; j >= 0; j--) {
                const item = items[j];
                if (item.type === "travel" && item.travel?.to && !item.hotelId) {
                    return destinationObjects.find(d => d.name === item.travel?.to) || null;
                }
            }
        }
        return activeDestination;
    };

    const selectEntryPoint = (dest: DestinationObj) => {
        const entryItem: BuilderItem = {
            id: generateId(),
            type: "travel",
            order: 0,
            destinationToId: dest._id,
            travel: { from: "Entry Point", to: dest.name, duration: 0 },
        };
        setDays([{ day: 1, title: "Day 1", description: "", items: [entryItem] }]);
        setActiveDestination(dest);
        setEntryPointSelected(true);
    };

    const addDay = () => {
        setDays(prev => [...prev, { day: prev.length + 1, title: `Day ${prev.length + 1}`, description: "", items: [] }]);
    };

    const removeDay = (index: number) => {
        if (days.length <= 1) return;
        setDays(prev => prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })));
    };

    const updateDayField = (dayIndex: number, field: "title" | "description", value: string) => {
        setDays(prev => {
            const updated = [...prev];
            updated[dayIndex] = { ...updated[dayIndex], [field]: value };
            return updated;
        });
    };

    const addExperience = (dayIndex: number, exp: ExperienceObj) => {
        const hours = calculateDayHours(days[dayIndex].items);
        const expHours = (() => {
            const match = (exp.duration || "").match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 2;
        })();
        if (hours + expHours > 18) {
            toast.error(`Adding this would exceed the 18-hour daily limit (currently ${hours.toFixed(1)}h).`);
            return;
        }
        const newItem: BuilderItem = {
            id: generateId(),
            type: "experience",
            order: days[dayIndex].items.length,
            experienceId: exp.value,
            experience: { title: exp.label, duration: exp.duration || "2 Hours", image: exp.image },
        };
        setDays(prev => {
            const updated = [...prev];
            updated[dayIndex] = { ...updated[dayIndex], items: [...updated[dayIndex].items, newItem] };
            return updated;
        });
        setShowExpModal(false);
    };

    const addHotel = (dayIndex: number, hotel: HotelObj) => {
        if (days[dayIndex].items.some(item => item.hotelId)) {
            toast.error("Only one hotel per day allowed.");
            return;
        }
        const newItem: BuilderItem = {
            id: generateId(),
            type: "travel",
            order: days[dayIndex].items.length,
            hotelId: hotel.value,
            hotel: { name: hotel.label, image: hotel.image },
        };
        setDays(prev => {
            const updated = [...prev];
            updated[dayIndex] = { ...updated[dayIndex], items: [...updated[dayIndex].items, newItem] };
            // Auto-add next day if this is the last day
            if (dayIndex === updated.length - 1) {
                updated.push({ day: updated.length + 1, title: `Day ${updated.length + 1}`, description: "", items: [] });
            }
            return updated;
        });
        setShowHotelModal(false);
    };

    const moveToDestination = (dayIndex: number, dest: DestinationObj) => {
        const fromDest = getContextDestination(dayIndex) || activeDestination;
        const duration = fromDest ? getTravelTime(fromDest.name, dest.name) : 0;

        const hours = calculateDayHours(days[dayIndex].items);
        if (hours + duration > 18 && duration > 0) {
            toast.error(`Travel (${duration}h) would exceed the 18-hour daily limit. Consider moving to a new day.`);
            return;
        }

        const newItem: BuilderItem = {
            id: generateId(),
            type: "travel",
            order: days[dayIndex].items.length,
            destinationFromId: fromDest?._id,
            destinationToId: dest._id,
            travel: { from: fromDest?.name || "Previous Location", to: dest.name, duration },
        };
        setDays(prev => {
            const updated = [...prev];
            updated[dayIndex] = { ...updated[dayIndex], items: [...updated[dayIndex].items, newItem] };
            return updated;
        });
        setActiveDestination(dest);
        setShowDestModal(false);
    };

    const removeItem = (dayIndex: number, itemId: string) => {
        setDays(prev => {
            const updated = [...prev];
            updated[dayIndex] = {
                ...updated[dayIndex],
                items: updated[dayIndex].items.filter(item => item.id !== itemId),
            };
            return updated;
        });
    };

    const moveDay = (from: number, to: number) => {
        setDays(prev => {
            const updated = [...prev];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            return updated.map((d, i) => ({ ...d, day: i + 1 }));
        });
    };

    // ── Form submit ───────────────────────────────────────────────────────────

    const onSubmit = (data: Tour) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("slug", data.slug);
        formData.append("category", data.category || "");
        formData.append("description", data.description);
        formData.append("duration", data.duration);
        formData.append("price", String(calculateTotal() || data.price));
        formData.append("priority", String(data.priority));
        formData.append("highlights", JSON.stringify(data.highlights || []));
        formData.append("days", JSON.stringify(days));
        formData.append("image", data.image);
        formData.append("selectedCostIds", JSON.stringify(data.selectedCostIds || []));

        if (selectedFile) formData.append("imageFile", selectedFile);
        Object.entries(dayFiles).forEach(([index, file]) => {
            formData.append(`dayImage_${index}`, file);
        });

        startTransition(async () => {
            try {
                const result = await action(formData);
                if (result.success) {
                    toast.success(result.message);
                    router.push("/admin/tours");
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch {
                toast.error("An error occurred while saving the tour.");
            }
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-4 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Link href="/admin/tours" className="mb-4">
                    <Button
                        variant="outline"
                        onMouseEnter={() => iconRef.current?.startAnimation()}
                        onMouseLeave={() => iconRef.current?.stopAnimation()}
                        className="text-black"
                    >
                        <AnimatedArrowLeft ref={iconRef} className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <h2 className="text-2xl font-semibold tracking-tight text-black">{pageTitle}</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">

                {/* ── Section 1: Static metadata ── */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-black font-medium">Title *</Label>
                        <Input {...register("title")} placeholder="Spiritual Discovery: Nepal & Bhutan" className="bg-white border-gray-200 text-black" />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black font-medium">Slug *</Label>
                        <Input {...register("slug")} readOnly className="text-black bg-gray-100 cursor-not-allowed" />
                        {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black font-medium">Category</Label>
                        <Combobox
                            options={categoryOptions}
                            value={watch("category") || ""}
                            onChange={(val) => setValue("category", val)}
                            placeholder="Select Category"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black font-medium">Priority <span className="text-xs text-gray-500 font-normal">(Higher = Higher Priority)</span></Label>
                        <Input type="number" {...register("priority", { valueAsNumber: true })} placeholder="0" className="bg-white border-gray-200 text-black" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-black font-medium">Additional Costs</Label>
                        <MultiSelect
                            options={allCosts.map(cost => ({
                                value: (cost.id || cost._id) as string,
                                label: `${cost.title} (${cost.type === "daily" ? "Daily" : "Fixed"}: $${cost.price})`,
                            }))}
                            selected={watchedSelectedCostIds}
                            onChange={(vals) => setValue("selectedCostIds", vals)}
                            placeholder="Select costs to include..."
                        />
                        <p className="text-[10px] text-zinc-500 italic">These costs factor into the auto-calculated price.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-black font-medium">Description *</Label>
                    <Textarea {...register("description")} placeholder="Describe the tour..." className="min-h-[120px] bg-white border-gray-200 text-black resize-none" />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <ImageUpload
                    name="imageFile"
                    label="Cover Image"
                    defaultPreview={initialData?.image}
                    required
                    onFileSelect={setSelectedFile}
                />

                {/* ── Section 2: Daily Itinerary ── */}
                <div className="space-y-6 border-t border-gray-100 pt-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-black serif underline underline-offset-8 decoration-gray-200">Daily Itinerary</h3>
                        {entryPointSelected && activeDestination && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-sm">
                                    <MapPin className="h-3.5 w-3.5 text-amber-600" />
                                    <span className="text-xs font-semibold text-amber-800">{activeDestination.name}</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs text-gray-500"
                                    onClick={() => {
                                        setEntryPointSelected(false);
                                        setDays([]);
                                        setActiveDestination(null);
                                    }}
                                >
                                    Change Entry Point
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Entry Point Selector — shows only isEntryPoint destinations */}
                    {!entryPointSelected ? (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Select the starting destination (entry point) for this tour.</p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={entrySearch}
                                    onChange={e => setEntrySearch(e.target.value)}
                                    className="w-full text-black bg-white border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            {isLoadingOptions ? (
                                <div className="flex items-center justify-center h-32 text-gray-400">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading destinations...
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {entryPointDestinations
                                        .filter(d => d.name.toLowerCase().includes(entrySearch.toLowerCase()))
                                        .map(dest => (
                                            <button
                                                key={dest._id}
                                                type="button"
                                                onClick={() => selectEntryPoint(dest)}
                                                className="group relative overflow-hidden rounded-sm border border-gray-200 hover:border-amber-500 transition-all text-left"
                                            >
                                                {dest.image ? (
                                                    <img src={dest.image} alt={dest.name} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                                                        <MapPin className="h-6 w-6 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="p-2">
                                                    <p className="text-xs font-semibold text-black truncate">{dest.name}</p>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Day Builder */
                        <div className="space-y-6">
                            {days.map((day, dayIndex) => {
                                const hours = calculateDayHours(day.items);
                                const isOverLimit = hours > 18;
                                const isNearLimit = hours >= 12 && hours <= 18;
                                const hasHotel = day.items.some(item => item.hotelId);

                                return (
                                    <div key={dayIndex} className="border border-gray-200 overflow-hidden shadow-sm">
                                        {/* Day Header */}
                                        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-9 h-9 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                                    {dayIndex + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={day.title}
                                                    onChange={e => updateDayField(dayIndex, "title", e.target.value)}
                                                    placeholder={`Day ${dayIndex + 1}`}
                                                    className="flex-1 bg-transparent border-none font-semibold text-base text-black p-0 focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Hours indicator */}
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${isOverLimit ? "bg-red-50 text-red-600" : isNearLimit ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"}`}>
                                                    {isOverLimit && <AlertCircle className="h-3 w-3" />}
                                                    <Clock className="h-3 w-3" />
                                                    {hours.toFixed(1)}h / 18h
                                                </div>
                                                {/* <Button type="button" variant="outline" size="icon" onClick={() => dayIndex > 0 && moveDay(dayIndex, dayIndex - 1)} disabled={dayIndex === 0}>
                                                    <ChevronUp className="h-4 w-4" />
                                                </Button>
                                                <Button type="button" variant="outline" size="icon" onClick={() => dayIndex < days.length - 1 && moveDay(dayIndex, dayIndex + 1)} disabled={dayIndex === days.length - 1}>
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button> */}
                                                {days.length > 1 && (
                                                    <Button type="button" variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeDay(dayIndex)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            {/* Day image upload */}
                                            <ImageUpload
                                                name={`dayImage_${dayIndex}`}
                                                label="Day Image (optional)"
                                                defaultPreview={initialData?.days?.[dayIndex]?.image}
                                                onFileSelect={(file) => { if (file) setDayFiles(prev => ({ ...prev, [dayIndex]: file })); }}
                                            />

                                            {/* Day description */}
                                            <textarea
                                                value={day.description}
                                                onChange={e => updateDayField(dayIndex, "description", e.target.value)}
                                                placeholder="Brief description of this day..."
                                                rows={2}
                                                className="w-full text-sm text-black bg-white border border-gray-200 p-2.5 resize-none focus:outline-none focus:border-amber-500 placeholder:text-gray-300"
                                            />

                                            {/* Items list */}
                                            {day.items.length > 0 && (
                                                <div className="space-y-2">
                                                    {day.items.map(item => (
                                                        <div key={item.id} className="flex items-center gap-2 bg-white border border-gray-100 p-2.5 rounded-sm group">
                                                            {item.hotelId ? (
                                                                <>
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded shrink-0">
                                                                        <BedDouble className="h-3 w-3 text-blue-600" />
                                                                        <span className="text-[10px] font-bold text-blue-600 uppercase">Hotel</span>
                                                                    </div>
                                                                    <span className="text-sm text-black flex-1 font-medium">{item.hotel?.name || "Hotel"}</span>
                                                                </>
                                                            ) : item.type === "experience" ? (
                                                                <>
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded shrink-0">
                                                                        <Star className="h-3 w-3 text-amber-600" />
                                                                        <span className="text-[10px] font-bold text-amber-600 uppercase">Experience</span>
                                                                    </div>
                                                                    <span className="text-sm text-black flex-1 font-medium">{item.experience?.title || item.experienceId}</span>
                                                                    {item.experience?.duration && (
                                                                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                                                                            <Clock className="h-3 w-3" />{item.experience.duration}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : item.travel?.from === "Entry Point" ? (
                                                                <>
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded shrink-0">
                                                                        <MapPin className="h-3 w-3 text-green-600" />
                                                                        <span className="text-[10px] font-bold text-green-600 uppercase">Entry</span>
                                                                    </div>
                                                                    <span className="text-sm text-black flex-1 font-medium">{item.travel.to}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded shrink-0">
                                                                        <ArrowRightLeft className="h-3 w-3 text-slate-600" />
                                                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Travel</span>
                                                                    </div>
                                                                    <span className="text-sm text-black flex-1">
                                                                        {item.travel?.from} → {item.travel?.to}
                                                                    </span>
                                                                    {item.travel?.duration ? (
                                                                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                                                                            <Clock className="h-3 w-3" />{item.travel.duration}h
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                            {/* Don't allow removing the entry-point item on day 1 */}
                                                            {!(dayIndex === 0 && item.travel?.from === "Entry Point") && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(dayIndex, item.id)}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-gray-400 hover:text-red-500"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {isOverLimit && (
                                                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                    This day exceeds the 18-hour limit. Please remove some activities or move them to another day.
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-amber-700 border-amber-200 hover:bg-amber-50 text-xs"
                                                    onClick={() => { setActiveDayIndex(dayIndex); setShowExpModal(true); setExpSearch(""); }}
                                                >
                                                    <Star className="h-3 w-3 mr-1" /> Add Experience
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={hasHotel}
                                                    className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs disabled:opacity-40"
                                                    onClick={() => { setActiveDayIndex(dayIndex); setShowHotelModal(true); setHotelSearch(""); }}
                                                >
                                                    <BedDouble className="h-3 w-3 mr-1" /> {hasHotel ? "Hotel Added" : "Add Hotel"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-slate-700 border-slate-200 hover:bg-slate-50 text-xs"
                                                    onClick={() => { setActiveDayIndex(dayIndex); setShowDestModal(true); setDestSearch(""); }}
                                                >
                                                    <MapPin className="h-3 w-3 mr-1" /> Move to Destination
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add Day */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full py-8 border-dashed border-gray-300 text-gray-500 hover:text-black hover:border-black"
                                onClick={addDay}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Day {days.length + 1}
                            </Button>
                        </div>
                    )}
                </div>

                {/* ── Section 3: Duration + Price (after itinerary) ── */}
                <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-black font-medium">Duration <span className="text-xs text-gray-400 font-normal">(auto-calculated)</span></Label>
                        </div>
                        <Input
                            {...register("duration")}
                            readOnly
                            placeholder="Add days above to auto-fill"
                            className="bg-gray-100 text-black cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-black font-medium">Total Price (USD)</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => {
                                    const total = calculateTotal();
                                    setValue("price", total);
                                    toast.success(`Price synced: $${total}`);
                                }}
                            >
                                Re-sync Price
                            </Button>
                        </div>
                        <Input
                            type="number"
                            {...register("price", { valueAsNumber: true })}
                            placeholder="0.00"
                            className="bg-white border-gray-200 text-black font-medium text-lg"
                        />
                        {watchedSelectedCostIds.length > 0 && (
                            <p className="text-xs text-amber-600">* Includes {watchedSelectedCostIds.length} global fee(s) × {days.length} day(s)</p>
                        )}
                        {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                    </div>
                </div>

                {/* ── Submit ── */}
                <div className="flex justify-end gap-4 border-t border-gray-100 pt-8">
                    <Button variant="outline" type="button" asChild className="text-black border-gray-200">
                        <Link href="/admin/tours">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isPending} className="bg-amber-600 text-white hover:bg-amber-700 min-w-[150px]">
                        {isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                        ) : (
                            initialData ? "Update Tour" : "Create Tour"
                        )}
                    </Button>
                </div>
            </form>

            {/* ── Destination selector modal (all destinations except current) ── */}
            {showDestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowDestModal(false)}>
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl rounded-sm" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">// Navigation</p>
                                <h3 className="text-xl font-semibold text-black">Select Next Destination</h3>
                            </div>
                            <button onClick={() => setShowDestModal(false)} className="p-1.5 hover:bg-gray-100 rounded"><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    autoFocus
                                    value={destSearch}
                                    onChange={e => setDestSearch(e.target.value)}
                                    placeholder="Search destinations..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm text-black focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
                            {destinationObjects
                                .filter(d => d._id !== (getContextDestination(activeDayIndex ?? 0) || activeDestination)?._id)
                                .filter(d => d.name.toLowerCase().includes(destSearch.toLowerCase()))
                                .map(dest => (
                                    <button
                                        key={dest._id}
                                        type="button"
                                        onClick={() => activeDayIndex !== null && moveToDestination(activeDayIndex, dest)}
                                        className="group relative overflow-hidden rounded-sm border border-gray-200 hover:border-amber-500 transition-all text-left"
                                    >
                                        {dest.image ? (
                                            <img src={dest.image} alt={dest.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-20 bg-gray-100 flex items-center justify-center"><MapPin className="h-6 w-6 text-gray-300" /></div>
                                        )}
                                        <div className="p-2">
                                            <p className="text-xs font-semibold text-black">{dest.name}</p>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Experience selector modal (filtered by active destination) ── */}
            {showExpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowExpModal(false)}>
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl rounded-sm" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">// Curated Activity</p>
                                <h3 className="text-xl font-semibold text-black">Add Experience</h3>
                                {activeDayIndex !== null && (getContextDestination(activeDayIndex) || activeDestination) && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Showing experiences for <span className="font-semibold text-amber-700">{(getContextDestination(activeDayIndex) || activeDestination)?.name}</span>
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setShowExpModal(false)} className="p-1.5 hover:bg-gray-100 rounded"><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    autoFocus
                                    value={expSearch}
                                    onChange={e => setExpSearch(e.target.value)}
                                    placeholder="Search experiences..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm text-black focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                            {(() => {
                                const dest = activeDayIndex !== null ? (getContextDestination(activeDayIndex) || activeDestination) : activeDestination;
                                const filtered = experienceOptions.filter(e => {
                                    if (!dest) return true;
                                    const byId = e.destinationIds?.includes(dest._id);
                                    const bySlug = dest.slug ? e.destinationSlug === dest.slug : false;
                                    return byId || bySlug;
                                }).filter(e => e.label.toLowerCase().includes(expSearch.toLowerCase()));

                                if (filtered.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <Star className="h-8 w-8 mb-3 opacity-30" />
                                            <p className="text-sm">No experiences found for this destination.</p>
                                        </div>
                                    );
                                }

                                return filtered.map(exp => (
                                    <button
                                        key={exp.value}
                                        type="button"
                                        onClick={() => activeDayIndex !== null && addExperience(activeDayIndex, exp)}
                                        className="w-full flex items-center gap-3 p-3 border border-gray-100 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left rounded-sm"
                                    >
                                        {exp.image ? (
                                            <img src={exp.image} alt={exp.label} className="w-12 h-12 object-cover rounded shrink-0" />
                                        ) : (
                                            <div className="w-12 h-12 bg-amber-50 rounded flex items-center justify-center shrink-0"><Star className="h-5 w-5 text-amber-400" /></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-black truncate">{exp.label}</p>
                                            <p className="text-xs text-gray-400">{exp.duration} {exp.price ? `· $${exp.price}` : ""}</p>
                                        </div>
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Hotel selector modal (filtered by active destination) ── */}
            {showHotelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowHotelModal(false)}>
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl rounded-sm" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">// Overnight Stay</p>
                                <h3 className="text-xl font-semibold text-black">Select Hotel</h3>
                                {activeDayIndex !== null && (getContextDestination(activeDayIndex) || activeDestination) && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Showing hotels for <span className="font-semibold text-blue-700">{(getContextDestination(activeDayIndex) || activeDestination)?.name}</span>
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setShowHotelModal(false)} className="p-1.5 hover:bg-gray-100 rounded"><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    autoFocus
                                    value={hotelSearch}
                                    onChange={e => setHotelSearch(e.target.value)}
                                    placeholder="Search hotels..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm text-black focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                            {(() => {
                                const dest = activeDayIndex !== null ? (getContextDestination(activeDayIndex) || activeDestination) : activeDestination;
                                const filtered = hotelOptions.filter(h => {
                                    if (!dest) return true;
                                    const byId = h.destinationId === dest._id;
                                    const bySlug = dest.slug ? h.destinationSlug === dest.slug : false;
                                    return byId || bySlug;
                                }).filter(h => h.label.toLowerCase().includes(hotelSearch.toLowerCase()));

                                if (filtered.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <BedDouble className="h-8 w-8 mb-3 opacity-30" />
                                            <p className="text-sm">No hotels found for this destination.</p>
                                        </div>
                                    );
                                }

                                return filtered.map(hotel => (
                                    <button
                                        key={hotel.value}
                                        type="button"
                                        onClick={() => activeDayIndex !== null && addHotel(activeDayIndex, hotel)}
                                        className="w-full flex items-center gap-3 p-3 border border-gray-100 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left rounded-sm"
                                    >
                                        {hotel.image ? (
                                            <img src={hotel.image} alt={hotel.label} className="w-12 h-12 object-cover rounded shrink-0" />
                                        ) : (
                                            <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center shrink-0"><BedDouble className="h-5 w-5 text-blue-400" /></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-black truncate">{hotel.label}</p>
                                            {hotel.price ? <p className="text-xs text-gray-400">${hotel.price}/night</p> : null}
                                        </div>
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
