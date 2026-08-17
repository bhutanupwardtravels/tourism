"use client";

import { Table } from "@tanstack/react-table";
import { Plus, Search, Settings2, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function TiersDataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by trip threshold..."
                        value={(table.getColumn("minPriorTrips")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("minPriorTrips")?.setFilterValue(event.target.value)
                        }
                        className="h-9 pl-9 text-black border-gray-200 bg-white focus-visible:ring-amber-500"
                    />
                </div>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-9 text-black hover:bg-gray-100 rounded-none text-xs"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <Link href="/admin/promotions/loyalty/settings">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-9 text-black border-gray-200 rounded-none font-bold text-xs uppercase tracking-widest px-4"
                    >
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </Link>
                <Link href="/admin/promotions/loyalty/create">
                    <Button
                        size="sm"
                        className="h-9 bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest px-4"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tier
                    </Button>
                </Link>
            </div>
        </div>
    );
}
