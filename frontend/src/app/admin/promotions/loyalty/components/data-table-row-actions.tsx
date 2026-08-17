"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoyaltyTierRow } from "../schema";
import { DeleteTierDialog } from "./delete-tier-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const tier = row.original as LoyaltyTierRow;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteTierDialog
                tier={tier}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="rounded-none">
                    <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
                        <MoreHorizontal className="text-black" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] rounded-none">
                    <Link href={`/admin/promotions/loyalty/${tier.minPriorTrips}/edit`}>
                        <DropdownMenuItem className="text-green-500 focus:text-green-500 rounded-none cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4 text-green-500" /> Edit
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-500 focus:text-red-500 rounded-none cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
