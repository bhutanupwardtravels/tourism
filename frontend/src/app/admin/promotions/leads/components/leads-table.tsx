"use client";

import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Download, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table/data-table";
import { columns } from "./columns";
import { PromoLead } from "../schema";
import { exportLeadsCsv } from "../actions";
import { LeadFilters } from "@/lib/data/promo-leads";

interface LeadsTableProps {
    data: PromoLead[];
    pageCount: number;
    pagination: PaginationState;
    campaigns: { title: string; value: string }[];
    filters: LeadFilters;
}

// Sentinel for "no filter" — Radix Select can't hold an empty-string value.
const ANY = "__any__";

export function LeadsTable({ data, pageCount, pagination, campaigns, filters }: LeadsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isExporting, setIsExporting] = useState(false);
    const [emailSearch, setEmailSearch] = useState(searchParams.get("email") ?? "");

    // Filters live in the URL so the view is shareable and the export matches
    // exactly what's on screen.
    const setParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== ANY) params.set(key, value);
        else params.delete(key);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasFilters =
        !!filters.campaignId || !!filters.redeemed || !!filters.followUpMonths || !!emailSearch;

    const resetFilters = () => {
        setEmailSearch("");
        router.push(pathname);
    };

    const handleExport = async () => {
        setIsExporting(true);
        const result = await exportLeadsCsv(filters);
        setIsExporting(false);

        if (!result.success || !result.csv) {
            toast.error(result.message || "Failed to export leads");
            return;
        }

        const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(result.message);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap items-center gap-2 w-full md:w-auto">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setParam("email", emailSearch);
                        }}
                        className="relative w-full md:w-[280px]"
                    >
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search by email..."
                            value={emailSearch}
                            onChange={(e) => setEmailSearch(e.target.value)}
                            className="h-9 pl-9 text-black border-gray-200 bg-white focus-visible:ring-amber-500"
                        />
                    </form>

                    <Select
                        value={filters.campaignId ?? ANY}
                        onValueChange={(v) => setParam("campaignId", v)}
                    >
                        <SelectTrigger className="h-9 w-[190px] rounded-none bg-white border-gray-200 text-black">
                            <SelectValue placeholder="All campaigns" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value={ANY}>All campaigns</SelectItem>
                            {campaigns.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                    {c.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.redeemed ?? ANY} onValueChange={(v) => setParam("redeemed", v)}>
                        <SelectTrigger className="h-9 w-[150px] rounded-none bg-white border-gray-200 text-black">
                            <SelectValue placeholder="All codes" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value={ANY}>All codes</SelectItem>
                            <SelectItem value="false">Not redeemed</SelectItem>
                            <SelectItem value="true">Redeemed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.followUpMonths ? String(filters.followUpMonths) : ANY}
                        onValueChange={(v) => setParam("followUpMonths", v)}
                    >
                        <SelectTrigger className="h-9 w-[190px] rounded-none bg-white border-gray-200 text-black">
                            <SelectValue placeholder="Follow-up due" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value={ANY}>Any age</SelectItem>
                            <SelectItem value="1">Unbooked 1+ month</SelectItem>
                            <SelectItem value="3">Unbooked 3+ months</SelectItem>
                            <SelectItem value="6">Unbooked 6+ months</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            onClick={resetFilters}
                            className="h-9 text-black hover:bg-gray-100 rounded-none text-xs"
                        >
                            Reset <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="h-9 bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest px-4 shrink-0"
                >
                    {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Export CSV
                </Button>
            </div>

            <DataTable
                data={data}
                columns={columns}
                pageCount={pageCount}
                pagination={pagination}
                emptyMessage="No leads captured yet."
            />
        </div>
    );
}
