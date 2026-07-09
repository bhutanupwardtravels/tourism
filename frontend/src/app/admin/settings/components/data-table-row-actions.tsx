"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Cost } from "../schema";
import { DeleteCostDialog } from "./delete-cost-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const cost = row.original as Cost;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteCostDialog
                cost={cost}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="rounded-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="data-[state=open]:bg-muted size-8"
                    >
                        <MoreHorizontal className="text-black" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] rounded-none">
                    <Link href={`/admin/settings/${cost.id || cost._id}/edit`}>
                        <DropdownMenuItem
                            className="text-green-500 focus:text-green-500 data-[variant=default]:text-green-500 data-[variant=default]:focus:bg-green-100 rounded-none cursor-pointer"
                        >
                            <Pencil className="mr-2 h-4 w-4 text-green-500 focus:text-green-500 data-[variant=default]:text-green-500" /> Edit
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-500 focus:text-red-500 data-[variant=default]:text-red-500 data-[variant=default]:focus:bg-red-100 rounded-none cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-500 focus:text-red-500 data-[variant=default]:text-red-500" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
