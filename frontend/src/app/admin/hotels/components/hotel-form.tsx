"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Pencil, Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatedArrowLeft, type AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { cn } from "@/lib/utils";
import { generateSlug } from "@/utils/slug-generator";
import { getAllDestinations } from "@/app/admin/destinations/actions";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Hotel } from "../schema";

interface HotelFormProps {
    initialData?: Hotel;
    action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
    isReadOnly?: boolean;
}

export function HotelForm({ initialData, action, title, isReadOnly = false }: HotelFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const iconRef = useRef<AnimatedArrowLeftHandle>(null);

    // Form fields
    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [selectedDestination, setSelectedDestination] = useState<string>(initialData?.destination || initialData?.destinationId || initialData?.destinationSlug || "");
    const [priceRange, setPriceRange] = useState<string>(initialData?.priceRange || "");
    const [location, setLocation] = useState(initialData?.location || "");
    const [rating, setRating] = useState(initialData?.rating?.toString() || "");
    const [rooms, setRooms] = useState(initialData?.rooms?.toString() || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [latitude, setLatitude] = useState(initialData?.coordinates?.[0]?.toString() || "");
    const [longitude, setLongitude] = useState(initialData?.coordinates?.[1]?.toString() || "");
    const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
    const [amenityInput, setAmenityInput] = useState("");

    // UI state
    const [destinationOptions, setDestinationOptions] = useState<{ value: string; label: string }[]>([]);
    const [destinationsPopoverOpen, setDestinationsPopoverOpen] = useState(false);
    const [pricePopoverOpen, setPricePopoverOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Gallery state
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [existingGallery, setExistingGallery] = useState<string[]>(initialData?.gallery || []);

    const priceOptions = [
        { value: "Economy", label: "Economy" },
        { value: "Standard", label: "Standard" },
        { value: "Luxury", label: "Luxury" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const destinations = await getAllDestinations();
                setDestinationOptions(
                    destinations.map((dest) => ({
                        value: dest._id || dest.slug,
                        label: dest.name,
                    }))
                );
            } catch (error) {
                toast.error("Failed to fetch destinations");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const addAmenity = () => {
        if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
            setAmenities([...amenities, amenityInput.trim()]);
            setAmenityInput("");
        }
    };

    const removeAmenity = (amenityToRemove: string) => {
        setAmenities(amenities.filter((a) => a !== amenityToRemove));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // Add amenities
        formData.set("amenities", amenities.join("\n"));

        // Add dynamic fields
        formData.set("destinationId", selectedDestination);
        formData.set("priceRange", priceRange);

        // Add gallery
        if (initialData) {
            formData.set("existingGallery", JSON.stringify(existingGallery));
        }
        galleryFiles.forEach((file) => {
            formData.append(`gallery`, file);
        });

        // Add ID if it exists (might be needed for some actions)
        if (initialData?.id) {
            formData.set("id", initialData.id);
        }

        startTransition(async () => {
            try {
                const result = await action(formData);

                if (result.success) {
                    toast.success(result.message);
                    router.push("/admin/hotels");
                    router.refresh();
                } else {
                    toast.error(result.message || `Failed to ${initialData ? 'update' : 'create'} hotel`);
                }
            } catch (error) {
                toast.error(`Failed to ${initialData ? 'update' : 'create'} hotel`);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-4 md:p-8 pt-6 relative border-black">
            {isReadOnly && (
                <Link
                    href={`/admin/hotels/${initialData?.id}/edit`}
                    className="fixed top-24 right-8 z-50 text-white"
                >
                    <Button className="bg-amber-600 hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
                        <Pencil className="w-5 h-5" />
                    </Button>
                </Link>
            )}

            <div className="flex flex-col gap-2">
                <Link href="/admin/hotels" className="mb-4">
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
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    {title}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Slug */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-black">Hotel Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            readOnly={isReadOnly}
                            placeholder="e.g. Aman Kora"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (!isReadOnly) {
                                    setSlug(generateSlug(e.target.value));
                                }
                            }}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-black">Slug *</Label>
                        <Input
                            id="slug"
                            name="slug"
                            required
                            placeholder="aman-kora"
                            value={slug}
                            readOnly
                            className="text-black bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Destination & Price */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-black font-semibold">Destination *</Label>
                        <Popover open={destinationsPopoverOpen} onOpenChange={setDestinationsPopoverOpen}>
                            <PopoverTrigger className="rounded-none" asChild disabled={isReadOnly}>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={destinationsPopoverOpen}
                                    className="w-full justify-between bg-white border-gray-200 text-black hover:bg-white"
                                    disabled={isReadOnly}
                                >
                                    {selectedDestination
                                        ? destinationOptions.find((opt) => opt.value === selectedDestination)?.label
                                        : "Select a destination..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search destinations..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No destination found.</CommandEmpty>
                                        <CommandGroup>
                                            {destinationOptions.map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    value={opt.label}
                                                    onSelect={() => {
                                                        setSelectedDestination(opt.value);
                                                        setDestinationsPopoverOpen(false);
                                                    }}
                                                >
                                                    {opt.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            selectedDestination === opt.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority" className="text-black">Priority <span className="text-xs text-gray-500 font-normal">(Higher Value = Higher Priority)</span></Label>
                        <Input
                            id="priority"
                            name="priority"
                            type="number"
                            min="0"
                            placeholder="e.g. 10"
                            defaultValue={initialData?.priority}
                            readOnly={isReadOnly}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>

                </div>

                {/* Priority & Cost Price */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-black">Price</Label>
                        <div className="relative">
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                defaultValue={initialData?.price}
                                readOnly={isReadOnly}
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black font-semibold">Price Category *</Label>
                        <Popover open={pricePopoverOpen} onOpenChange={setPricePopoverOpen}>
                            <PopoverTrigger className="rounded-none" asChild disabled={isReadOnly}>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={pricePopoverOpen}
                                    className="w-full justify-between bg-white border-gray-200 text-black hover:bg-white"
                                    disabled={isReadOnly}
                                >
                                    {priceRange ? priceRange : "Select price range..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search price range..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No range found.</CommandEmpty>
                                        <CommandGroup>
                                            {priceOptions.map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                    onSelect={() => {
                                                        setPriceRange(opt.value);
                                                        setPricePopoverOpen(false);
                                                    }}
                                                >
                                                    {opt.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            priceRange === opt.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Rating & Rooms */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rating" className="text-black">Rating (1-5) *</Label>
                        <Input
                            id="rating"
                            name="rating"
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            required
                            readOnly={isReadOnly}
                            placeholder="4.5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rooms" className="text-black">Number of Rooms</Label>
                        <Input
                            id="rooms"
                            name="rooms"
                            type="number"
                            min="1"
                            placeholder="50"
                            readOnly={isReadOnly}
                            value={rooms}
                            onChange={(e) => setRooms(e.target.value)}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>
                </div>

                {/* Location (Sub-area/Address) */}
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-black">Location (Sub-area/Address)</Label>
                    <Input
                        id="location"
                        name="location"
                        readOnly={isReadOnly}
                        placeholder="e.g. Upper Motithang, near the viewpoint"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-white border-gray-200 text-black"
                    />
                </div>

                {/* Coordinates */}
                <div className="border p-4 space-y-4 ">
                    <Label className="text-black font-semibold">Coordinates</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude" className="text-black text-xs font-medium uppercase tracking-wider">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                readOnly={isReadOnly}
                                placeholder="27.4728"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude" className="text-black text-xs font-medium uppercase tracking-wider">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                readOnly={isReadOnly}
                                placeholder="89.6393"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-black">Description *</Label>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        readOnly={isReadOnly}
                        placeholder="Describe the hotel and its unique features..."
                        className="min-h-[150px] resize-none bg-white border-gray-200 text-black"
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                    <Label className="text-black font-semibold">Amenities</Label>
                    {!isReadOnly && (
                        <div className="flex gap-2">
                            <Input
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addAmenity();
                                    }
                                }}
                                placeholder="Add amenity (e.g. WiFi, Spa, Rooftop Pool)"
                                className="bg-white border-gray-200 text-black"
                            />
                            <Button type="button" onClick={addAmenity} size="icon" className="bg-black text-white hover:bg-black/90">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 min-h-[50px] p-4 border border-gray-100 bg-gray-50/30 rounded-xs">
                        {amenities.map((amenity) => (
                            <div
                                key={amenity}
                                className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs font-medium text-black border border-gray-200 shadow-xs"
                            >
                                {amenity}
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={() => removeAmenity(amenity)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {amenities.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No amenities listed yet.</p>
                        )}
                    </div>
                </div>

                {/* Cover Image */}
                <ImageUpload
                    name="image"
                    label="Cover Image *"
                    required={!initialData}
                    defaultPreview={initialData?.image}
                    readOnly={isReadOnly}
                />

                {/* Gallery */}
                <GalleryUpload
                    label="Gallery Images"
                    initialImages={initialData?.gallery}
                    onImagesChange={(files, existing) => {
                        setGalleryFiles(files);
                        setExistingGallery(existing);
                    }}
                    readOnly={isReadOnly}
                />

                {/* Submit Actions */}
                {!isReadOnly && (
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/admin/hotels">
                            <Button variant="outline" type="button" className="text-black min-w-[100px]">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-amber-600 hover:bg-amber-700 text-white min-w-[150px] font-medium"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {initialData ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    {initialData ? "Update Hotel" : "Create Hotel"}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
