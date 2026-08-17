"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PromoCampaign } from "../schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function formatDate(value?: string | null) {
    if (!value) return null;
    return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Whether the banner is actually on screen right now — active alone isn't
 * enough, since a campaign can be enabled but scheduled or already finished.
 */
function bannerState(campaign: PromoCampaign): { label: string; tone: string } {
    if (!campaign.isActive) return { label: "Paused", tone: "bg-gray-100 text-gray-700 border-gray-200" };

    const now = Date.now();
    if (campaign.bannerStartsAt && new Date(campaign.bannerStartsAt).getTime() > now) {
        return { label: "Scheduled", tone: "bg-blue-100 text-blue-800 border-blue-200" };
    }
    if (campaign.bannerEndsAt && new Date(campaign.bannerEndsAt).getTime() < now) {
        return { label: "Ended", tone: "bg-rose-100 text-rose-800 border-rose-200" };
    }
    return { label: "Live", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" };
}

export const columns: ColumnDef<PromoCampaign>[] = [
    {
        accessorKey: "name",
        header: "Campaign",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-zinc-900 truncate max-w-[260px]" title={row.original.name}>
                    {row.original.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono tracking-tight">
                    {row.original.codePrefix}-XXXXXX
                </span>
            </div>
        ),
    },
    {
        accessorKey: "discountPercent",
        header: "Discount",
        cell: ({ row }) => (
            <span className="text-xs font-bold text-zinc-700">{row.original.discountPercent}%</span>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const state = bannerState(row.original);
            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "w-fit rounded-none uppercase text-[9px] font-bold tracking-widest px-2 py-0.5",
                        state.tone
                    )}
                >
                    {state.label}
                </Badge>
            );
        },
    },
    {
        id: "window",
        header: "Banner Window",
        cell: ({ row }) => {
            const from = formatDate(row.original.bannerStartsAt);
            const to = formatDate(row.original.bannerEndsAt);
            return (
                <span className="text-xs text-zinc-600">
                    {from || "Always"} &rarr; {to || "No end"}
                </span>
            );
        },
    },
    {
        id: "lifecycle",
        header: "Code Lifecycle",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs text-zinc-700">
                    Valid {row.original.couponValidDays} days
                </span>
                {row.original.couponEligibleAfterDays > 0 && (
                    <span className="text-[10px] text-zinc-400">
                        Redeemable after {row.original.couponEligibleAfterDays} days
                    </span>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
