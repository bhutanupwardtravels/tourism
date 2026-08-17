"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { countryName } from "@/lib/countries";
import { PromoLead } from "../schema";

function shortDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** Where this code stands right now, which is what the operator is scanning for. */
function codeState(lead: PromoLead): { label: string; tone: string } {
    if (lead.redeemedAt) return { label: "Redeemed", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" };

    const now = Date.now();
    if (lead.expiresAt && new Date(lead.expiresAt).getTime() < now) {
        return { label: "Expired", tone: "bg-gray-100 text-gray-600 border-gray-200" };
    }
    if (lead.eligibleFrom && new Date(lead.eligibleFrom).getTime() > now) {
        return { label: "Pending", tone: "bg-blue-100 text-blue-800 border-blue-200" };
    }
    return { label: "Unused", tone: "bg-amber-100 text-amber-800 border-amber-200" };
}

export const columns: ColumnDef<PromoLead>[] = [
    {
        accessorKey: "email",
        header: "Lead",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-zinc-900">
                    {row.original.firstName} {row.original.lastName}
                </span>
                <span className="text-[11px] text-zinc-500">{row.original.email}</span>
                <span className="text-[10px] text-zinc-400">{row.original.phone}</span>
            </div>
        ),
    },
    {
        accessorKey: "country",
        header: "Nationality",
        cell: ({ row }) => (
            <span className="text-xs text-zinc-700">
                {row.original.country ? countryName(row.original.country) || row.original.country : "—"}
            </span>
        ),
    },
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-mono text-xs tracking-wider text-zinc-900">{row.original.code}</span>
                <span className="text-[10px] text-zinc-400">{row.original.discountPercent}% off</span>
            </div>
        ),
    },
    {
        id: "state",
        header: "Status",
        cell: ({ row }) => {
            const state = codeState(row.original);
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
        accessorKey: "issuedAt",
        header: "Captured",
        cell: ({ row }) => (
            <span className="text-xs text-zinc-600">{shortDate(row.original.issuedAt)}</span>
        ),
    },
    {
        accessorKey: "expiresAt",
        header: "Expires",
        cell: ({ row }) => (
            <span className="text-xs text-zinc-600">{shortDate(row.original.expiresAt)}</span>
        ),
    },
];
