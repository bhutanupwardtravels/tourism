"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Shield, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "username",
        header: "User Details",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            return (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-none border border-gray-100 shadow-sm",
                        role === "admin" ? "bg-amber-50" : "bg-gray-50"
                    )}>
                        {role === "admin" ? (
                            <Shield className="h-5 w-5 text-amber-600" />
                        ) : (
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 truncate max-w-[200px]" title={row.getValue("username")}>
                            {row.getValue("username")}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono tracking-tight lowercase">
                            {row.original.email}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">{row.getValue("email")}</span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Login ID</span>
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Access Level",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            const isAdmin = role === "admin";
            return (
                <div className="flex flex-col gap-1">
                    <Badge
                        variant="outline"
                        className={cn(
                            "w-fit rounded-none uppercase text-[10px] font-bold tracking-widest px-2 py-0.5",
                            isAdmin
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-zinc-50 text-zinc-600 border-zinc-200"
                        )}
                    >
                        {role}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined Date",
        cell: ({ row }) => {
            const date = row.getValue("createdAt");
            if (!date) return "-";
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">
                        {format(new Date(date as string), "MMM d, yyyy")}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Registration</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
