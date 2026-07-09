"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Check, ChevronsUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedArrowLeft, type AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { ImageUpload } from "@/components/admin/image-upload";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DZONGKHAGS, DZONGKHAG_REGIONS } from "@/constants/dzongkhags";
import { generateSlug } from "@/utils/slug-generator";
import { Destination } from "../schema";
import { getAllDestinations } from "../actions";

interface DestinationFormProps {
    initialData?: Destination;
    action: (idOrSlug: string, prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
    isReadOnly?: boolean;
}

export function DestinationForm({ initialData, action, title, isReadOnly = false }: DestinationFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [open, setOpen] = React.useState(false);
    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    // Form fields
    const [name, setName] = React.useState(initialData?.name || "");
    const [slug, setSlug] = React.useState(initialData?.slug || "");
    const [region, setRegion] = React.useState(initialData?.region || "");
    const [description, setDescription] = React.useState(initialData?.description || "");
    const [latitude, setLatitude] = React.useState(initialData?.coordinates?.[0]?.toString() || "");
    const [longitude, setLongitude] = React.useState(initialData?.coordinates?.[1]?.toString() || "");
    const [priority, setPriority] = React.useState(initialData?.priority || 0);
    const [isEntryPoint, setIsEntryPoint] = React.useState(initialData?.isEntryPoint || false);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(initialData?.image || null);
    const [availableDzongkhags, setAvailableDzongkhags] = React.useState<string[]>([]);
    const [isLoadingDzongkhags, setIsLoadingDzongkhags] = React.useState(true);

    // Fetch existing destinations and filter available Dzongkhags
    React.useEffect(() => {
        const fetchAvailableDzongkhags = async () => {
            try {
                const allDestinations = await getAllDestinations();
                const usedDzongkhags = allDestinations.map((dest: any) => dest.name);

                // Filter out used Dzongkhags, but keep the current one if editing
                const available = DZONGKHAGS.filter(dzongkhag => {
                    if (initialData && dzongkhag === initialData.name) {
                        return true; // Allow current destination's name
                    }
                    return !usedDzongkhags.includes(dzongkhag);
                });

                setAvailableDzongkhags(available);
            } catch (error) {
                toast.error("Failed to load available Dzongkhags");
                setAvailableDzongkhags(DZONGKHAGS); // Fallback to all
            } finally {
                setIsLoadingDzongkhags(false);
            }
        };

        fetchAvailableDzongkhags();
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                // For updates, use _id; for creates, use empty string or slug
                const idOrSlug = initialData?._id || initialData?.slug || "";
                const result = await action(idOrSlug, null, formData);

                if (result.success) {
                    toast.success(result.message);
                    router.push("/admin/destinations");
                } else {
                    toast.error(result.message || `Failed to ${initialData ? 'update' : 'create'} destination`);
                }
            } catch (error) {
                toast.error(`Failed to ${initialData ? 'update' : 'create'} destination`);
            }
        });
    };

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-4 md:p-8 pt-6 relative">
            {isReadOnly && (
                <Link
                    href={`/admin/destinations/${initialData?.slug}/edit`}
                    className="fixed top-24 right-8 z-50"
                >
                    <Button className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
                        <Pencil className="w-5 h-5" />
                    </Button>
                </Link>
            )}
            <div className="flex flex-col gap-2">
                <Link href="/admin/destinations" className="mb-4">
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
            <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-black">Hotel Name *</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger className="rounded-none" asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        disabled={isReadOnly}
                                        className="w-full justify-between text-black bg-white"
                                    >
                                        {isLoadingDzongkhags ? "Loading..." : name
                                            ? availableDzongkhags.find((dzongkhag) => dzongkhag === name) || name
                                            : "Select a Dzongkhag..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                {!isReadOnly && (
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search dzongkhag..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>{isLoadingDzongkhags ? "Loading..." : "No available dzongkhag found."}</CommandEmpty>
                                                <CommandGroup>
                                                    {availableDzongkhags.map((dzongkhag) => (
                                                        <CommandItem
                                                            key={dzongkhag}
                                                            value={dzongkhag}
                                                            onSelect={() => {
                                                                setName(dzongkhag);
                                                                setSlug(generateSlug(dzongkhag));
                                                                setRegion(DZONGKHAG_REGIONS[dzongkhag] || "");
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            {dzongkhag}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    name === dzongkhag ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                )}
                            </Popover>
                            <input type="hidden" name="name" value={name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-black">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                readOnly
                                placeholder="destination-slug"
                                value={slug}
                                className="text-black bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="region" className="text-black">Region *</Label>
                            <Input
                                id="region"
                                name="region"
                                required
                                placeholder="e.g., Western Bhutan"
                                value={region}
                                readOnly
                                className="text-black bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-black">Priority <span className="text-xs text-gray-500 font-normal">(Higher Value = Higher Priority)</span></Label>
                            <Input
                                id="priority"
                                name="priority"
                                type="number"
                                placeholder="0"
                                value={priority}
                                readOnly={isReadOnly}
                                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                                className="text-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-black">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            readOnly={isReadOnly}
                            placeholder="Describe the destination..."
                            className="min-h-[150px] resize-none text-black"
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="border p-4 space-y-4">
                        <h3 className="font-semibold text-black">Coordinates</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude" className="text-black">Latitude *</Label>
                                <Input
                                    id="latitude"
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    required
                                    readOnly={isReadOnly}
                                    placeholder="27.4728"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    className="text-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="longitude" className="text-black">Longitude *</Label>
                                <Input
                                    id="longitude"
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    required
                                    readOnly={isReadOnly}
                                    placeholder="89.6393"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    className="text-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isEntryPoint"
                                checked={isEntryPoint}
                                onCheckedChange={(checked) => setIsEntryPoint(checked as boolean)}
                                disabled={isReadOnly}
                            />
                            <input type="hidden" name="isEntryPoint" value={isEntryPoint ? "true" : "false"} />
                            <Label htmlFor="isEntryPoint" className="mb-0 text-black">
                                Is Entry Point
                            </Label>
                        </div>
                        <p className="text-sm text-gray-500">
                            Check if this is a valid arrival point for international visitors
                        </p>
                    </div>

                    <ImageUpload
                        required={!previewUrl}
                        defaultPreview={previewUrl}
                        readOnly={isReadOnly}
                        onFileSelect={(file) => {
                            if (file) setPreviewUrl(URL.createObjectURL(file));
                            else setPreviewUrl(null);
                        }}
                    />

                    {!isReadOnly && (
                        <div className="flex justify-end gap-4">
                            <Link href="/admin/destinations">
                                <Button variant="outline" type="button" className="text-black">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isPending} className="bg-amber-600 hover:bg-amber-700 text-white min-w-[150px]">
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {initialData ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    initialData ? "Update Destination" : "Create Destination"
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
