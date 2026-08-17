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

interface Option {
    value: string;
    label: string;
}

interface OptionSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    /** id of the visible <label> naming this control. */
    ariaLabelledBy?: string;
}

/** Same popover + searchable list style as CountrySelect/MonthSelect, for a fixed set of options. */
export function OptionSelect({ value, onChange, options, placeholder = "Select", ariaLabelledBy }: OptionSelectProps) {
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    aria-labelledby={ariaLabelledBy}
                    className="flex w-full items-center justify-between py-4 text-lg font-light text-black focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                    <span className={cn(!selected && "text-gray-300")}>
                        {selected ? selected.label : placeholder}
                    </span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 rounded-none p-0">
                <Command
                    filter={(itemValue, search) =>
                        itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
                    }
                    className="rounded-none"
                >
                    <CommandInput placeholder="Search..." />
                    <CommandList className="max-h-72">
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className="rounded-none"
                                >
                                    <Check
                                        className={cn(
                                            "size-4",
                                            option.value === value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
