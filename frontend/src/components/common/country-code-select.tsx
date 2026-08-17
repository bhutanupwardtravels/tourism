"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { COUNTRIES, countryFlagEmoji } from "@/lib/countries";

interface CountryCodeSelectProps {
    value: string; // ISO2 country code, e.g. "BT"
    onChange: (iso2: string) => void;
    /** Extra classes for the dropdown panel — needed when the trigger sits inside
     *  an overlay stacked above the popover's default z-50. */
    contentClassName?: string;
    /** id of the visible <label> naming this control. */
    ariaLabelledBy?: string;
}

export function CountryCodeSelect({ value, onChange, contentClassName, ariaLabelledBy }: CountryCodeSelectProps) {
    const [open, setOpen] = useState(false);
    const selected = COUNTRIES.find((country) => country.iso2 === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    aria-labelledby={ariaLabelledBy}
                    className="flex shrink-0 items-center gap-1 py-4 text-lg font-light text-black focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                    {selected ? `${countryFlagEmoji(selected.iso2)} ${selected.dialCode}` : "Code"}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className={cn("w-72 rounded-none p-0", contentClassName)}>
                <Command
                    filter={(itemValue, search) =>
                        itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
                    }
                    className="rounded-none"
                >
                    <CommandInput placeholder="Search country or code..." />
                    <CommandList className="max-h-72">
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {COUNTRIES.map((country) => (
                                <CommandItem
                                    key={country.iso2}
                                    value={`${country.name} ${country.dialCode}`}
                                    onSelect={() => {
                                        onChange(country.iso2);
                                        setOpen(false);
                                    }}
                                    className="rounded-none"
                                >
                                    <Check
                                        className={cn(
                                            "size-4",
                                            country.iso2 === value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {countryFlagEmoji(country.iso2)} {country.name} ({country.dialCode})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
