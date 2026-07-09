"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectOption } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { Loader2, Save, Pencil, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedArrowLeft } from "@/components/ui/animated-arrow-left";
import type { AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { getAllDestinations } from "@/app/admin/destinations/actions";
import { getExperienceTypes } from "@/app/admin/experience-types/actions";
import { DatePicker } from "@/components/ui/date-picker";
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
import { cn } from "@/lib/utils";
import { parseISO, format } from "date-fns";
import { generateSlug } from "@/utils/slug-generator";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryUpload } from "@/components/admin/gallery-upload";

interface ExperienceFormProps {
    initialData?: any;
    action?: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    slug?: string | null;
    title: string;
    isReadOnly?: boolean;
}

export function ExperienceForm({ initialData, action, slug = null, title: pageTitle, isReadOnly = false }: ExperienceFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [selectedDestination, setSelectedDestination] = React.useState<string>(initialData?.destinationIds?.[0] || initialData?.destinations?.[0] || initialData?.destinationSlug || "");
    const [destinationOptions, setDestinationOptions] = React.useState<MultiSelectOption[]>([]);
    const [categoryOptions, setCategoryOptions] = React.useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [categoryPopoverOpen, setCategoryPopoverOpen] = React.useState(false);
    const [difficultyPopoverOpen, setDifficultyPopoverOpen] = React.useState(false);
    const [destinationsPopoverOpen, setDestinationsPopoverOpen] = React.useState(false);
    const [difficulty, setDifficulty] = React.useState<string>(initialData?.difficulty || "");

    // Gallery state synced for submission
    const [galleryFiles, setGalleryFiles] = React.useState<File[]>([]);
    const [existingGallery, setExistingGallery] = React.useState<string[]>(initialData?.gallery || []);

    const [startDate, setStartDate] = React.useState<Date | undefined>(initialData?.startDate ? parseISO(initialData.startDate) : undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(initialData?.endDate ? parseISO(initialData.endDate) : undefined);
    const [category, setCategory] = React.useState<string>(initialData?.categoryId || initialData?.category || "");

    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [destinations, expTypes] = await Promise.all([
                    getAllDestinations(),
                    getExperienceTypes(1, 100),
                ]);

                const destOptions = destinations.map((dest) => ({
                    value: dest._id || dest.slug, // Prefer ID
                    label: dest.name,
                }));

                const catOptions = expTypes.items.map((type) => ({
                    value: type._id || type.title, // Prefer ID
                    label: type.title,
                }));

                setDestinationOptions(destOptions);
                setCategoryOptions(catOptions);

                // Attempt to match legacy string values to IDs
                if (initialData) {
                    // Match Category
                    if (initialData.category && !catOptions.some(o => o.value === initialData.category)) {
                        const match = catOptions.find(o => o.label === initialData.category);
                        if (match) setCategory(match.value);
                    } else if (initialData.category && typeof initialData.category === 'object') {
                        setCategory(initialData.category._id || initialData.category.id);
                    }

                    // Match Destination
                    const initialDest = initialData.destinations?.[0] || initialData.destinationSlug;
                    if (initialDest && !destOptions.some(o => o.value === initialDest)) {
                        // Try to match by slug or label (if initialDest is slug)
                        // Destinations usually store slug in legacy.
                        const match = destinations.find(d => d.slug === initialDest || d.name === initialDest);
                        if (match) setSelectedDestination(match.id || match._id);
                    } else if (initialDest && typeof initialDest === 'object') {
                        setSelectedDestination(initialDest._id || initialDest.id);
                    }
                }

            } catch (error) {
                toast.error("Failed to fetch form dependencies");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!action) return;

        const formData = new FormData(event.currentTarget);

        formData.set("destinations", JSON.stringify(selectedDestination ? [selectedDestination] : []));
        formData.set("category", category);
        formData.set("difficulty", difficulty);

        const durationVal = formData.get("duration");
        if (durationVal) {
            formData.set("duration", `${durationVal} Hours`);
        }

        if (startDate) formData.set("startDate", format(startDate, "yyyy-MM-dd"));
        if (endDate) formData.set("endDate", format(endDate, "yyyy-MM-dd"));

        if (slug) {
            formData.set("existingGallery", JSON.stringify(existingGallery));
        }

        galleryFiles.forEach((file) => {
            formData.append(`gallery`, file);
        });

        startTransition(async () => {
            try {
                const result = await action(formData);
                if (result.success) {
                    toast.success(result.message);
                    router.push("/admin/experiences");
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("An error occurred while saving experience");
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
        <div className="flex-1 max-w-7xl mx-auto space-y-4 md:p-8 pt-6 relative">
            {isReadOnly && (
                <Link
                    href={`/admin/experiences/${initialData?.slug}/edit`}
                    className="fixed top-24 right-8 z-50"
                >
                    <Button className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
                        <Pencil className="w-5 h-5" />
                    </Button>
                </Link>
            )}

            <div className="flex flex-col gap-2">
                <Link href="/admin/experiences" className="mb-4">
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
                    {pageTitle}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-black">Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            required
                            placeholder="e.g. Tiger's Nest Hike"
                            defaultValue={initialData?.title}
                            readOnly={isReadOnly}
                            className="bg-white border-gray-200 text-black"
                            onChange={(e) => {
                                if (!isReadOnly) {
                                    const slugInput = document.getElementById('slug') as HTMLInputElement;
                                    if (slugInput) {
                                        slugInput.value = generateSlug(e.target.value);
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-black">Slug *</Label>
                        <Input
                            id="slug"
                            name="slug"
                            required
                            placeholder="tigers-nest-hike"
                            defaultValue={initialData?.slug}
                            readOnly
                            className="text-black bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-black">Category *</Label>
                        <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                            <PopoverTrigger className="rounded-none" asChild disabled={isReadOnly}>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={categoryPopoverOpen}
                                    className="w-full justify-between bg-white border-gray-200 text-black hover:bg-white"
                                    disabled={isReadOnly}
                                >
                                    {category
                                        ? categoryOptions.find((opt) => opt.value === category)?.label
                                        : "Select a category..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search category..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No category found.</CommandEmpty>
                                        <CommandGroup>
                                            {categoryOptions.map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                    onSelect={(currentValue) => {
                                                        setCategory(currentValue);
                                                        setCategoryPopoverOpen(false);
                                                    }}
                                                >
                                                    {opt.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            category === opt.value ? "opacity-100" : "opacity-0"
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
                        <Label htmlFor="duration" className="text-black">Duration (Hours)</Label>
                        <Input
                            id="duration"
                            name="duration"
                            type="number"
                            step="0.5"
                            min="0.5"
                            placeholder="e.g. 2.5"
                            defaultValue={initialData?.duration ? parseFloat(initialData.duration) : undefined}
                            readOnly={isReadOnly}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-black">Start Date <span className="text-xs text-gray-500 font-normal">(Optional - Festivals)</span></Label>
                        <DatePicker
                            date={startDate}
                            setDate={setStartDate}
                            placeholder="Select start date"
                            disabled={isReadOnly}
                            className="rounded-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black">End Date <span className="text-xs text-gray-500 font-normal">(Optional - Festivals)</span></Label>
                        <DatePicker
                            date={endDate}
                            setDate={setEndDate}
                            placeholder="Select end date"
                            disabled={isReadOnly}
                            className="rounded-none"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="difficulty" className="text-black">Difficulty</Label>
                        <Popover open={difficultyPopoverOpen} onOpenChange={setDifficultyPopoverOpen}>
                            <PopoverTrigger className="rounded-none" asChild disabled={isReadOnly}>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={difficultyPopoverOpen}
                                    className="w-full justify-between bg-white border-gray-200 text-black hover:bg-white"
                                    disabled={isReadOnly}
                                >
                                    {difficulty ? difficulty : "Select difficulty..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search difficulty..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No difficulty found.</CommandEmpty>
                                        <CommandGroup>
                                            {["Easy", "Moderate", "Challenging"].map((opt) => (
                                                <CommandItem
                                                    key={opt}
                                                    value={opt}
                                                    onSelect={(currentValue) => {
                                                        setDifficulty(opt);
                                                        setDifficultyPopoverOpen(false);
                                                    }}
                                                >
                                                    {opt}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            difficulty === opt ? "opacity-100" : "opacity-0"
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
                        <Label className="text-black font-semibold">Destination</Label>
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-black">Cost Price <span className="text-xs text-gray-500 font-normal">(Internal Reference)</span></Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                defaultValue={initialData?.price}
                                readOnly={isReadOnly}
                                className="bg-white border-gray-200 text-black pl-7"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-black">Description *</Label>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Describe the experience..."
                        readOnly={isReadOnly}
                        className="min-h-[150px] bg-white border-gray-200 text-black"
                        rows={6}
                        defaultValue={initialData?.description}
                    />
                </div>



                <div className="border p-4  space-y-4">
                    <Label className="text-black font-semibold">Coordinates</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude" className="text-black">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                placeholder="e.g. 27.4728"
                                defaultValue={initialData?.coordinates?.[0]}
                                readOnly={isReadOnly}
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude" className="text-black">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                placeholder="e.g. 89.6393"
                                defaultValue={initialData?.coordinates?.[1]}
                                readOnly={isReadOnly}
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>
                    </div>
                </div>

                <ImageUpload
                    defaultPreview={initialData?.image}
                    required={!initialData}
                    name="image"
                    label="Cover Image *"
                    readOnly={isReadOnly}
                />

                <GalleryUpload
                    initialImages={initialData?.gallery}
                    onImagesChange={(files, existing) => {
                        setGalleryFiles(files);
                        setExistingGallery(existing);
                    }}
                    readOnly={isReadOnly}
                    label="Gallery Images"
                />

                {!isReadOnly && (
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/admin/experiences">
                            <Button variant="outline" type="button" className="text-black">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-amber-600 text-white hover:bg-amber-700 min-w-[150px]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {initialData ? "Update Experience" : "Create Experience"}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
