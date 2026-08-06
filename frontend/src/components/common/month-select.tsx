"use client";

import { useMemo, useState } from "react";
import { addMonths, format, startOfMonth } from "date-fns";
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

interface MonthSelectProps {
    value: string; // stored as "March 2027" (year kept internally so it stays unambiguous), displayed as just "March"
    onChange: (value: string) => void;
    placeholder?: string;
    monthsAhead?: number; // how many upcoming months to list, starting this month
}

export function MonthSelect({ value, onChange, placeholder = "Select month", monthsAhead = 24 }: MonthSelectProps) {
    const [open, setOpen] = useState(false);

    // Rolls forward from the current month, so a bare month name like "March"
    // always resolves to the correct (possibly next) year automatically —
    // no hardcoded year, and nothing to update by hand next year.
    const months = useMemo(() => {
        const start = startOfMonth(new Date());
        return Array.from({ length: monthsAhead }, (_, i) => {
            const date = addMonths(start, i);
            return { label: format(date, "MMMM"), full: format(date, "MMMM yyyy") };
        });
    }, [monthsAhead]);

    const displayLabel = value ? value.split(" ")[0] : "";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-lg font-light text-black focus:outline-none"
                >
                    <span className={cn(!displayLabel && "text-gray-300")}>
                        {displayLabel || placeholder}
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
                    <CommandInput placeholder="Search month..." />
                    <CommandList className="max-h-72">
                        <CommandEmpty>No month found.</CommandEmpty>
                        <CommandGroup>
                            {months.map((month) => (
                                <CommandItem
                                    key={month.full}
                                    value={month.full}
                                    onSelect={() => {
                                        onChange(month.full);
                                        setOpen(false);
                                    }}
                                    className="rounded-none"
                                >
                                    <Check
                                        className={cn(
                                            "size-4",
                                            month.full === value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {month.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
