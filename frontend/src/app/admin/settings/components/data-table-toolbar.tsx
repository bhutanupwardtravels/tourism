"use client";

import { Table } from "@tanstack/react-table";
import { X, Search, Plus, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableViewOptions } from "@/components/admin/data-table/data-table-view-options";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    view?: "list" | "grid";
    onViewChange?: (view: "list" | "grid") => void;
}

export function SettingsDataTableToolbar<TData>({
    table,
    view,
    onViewChange,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search global costs..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("title")?.setFilterValue(event.target.value)
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
                <DataTableViewOptions table={table} />
                <Link href="/admin/settings/create">
                    <Button size="sm" className="h-9 bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Cost
                    </Button>
                </Link>

                {onViewChange && (
                    <div className="flex items-center gap-1 border rounded-none p-1 bg-white shadow-xs">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewChange("list")}
                            className={`h-7 w-7 rounded-none ${view === "list" ? "bg-black text-zinc-100" : "text-zinc-400 hover:text-black"}`}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewChange("grid")}
                            className={`h-7 w-7 rounded-none ${view === "grid" ? "bg-black text-zinc-100" : "text-zinc-400 hover:text-black"}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
