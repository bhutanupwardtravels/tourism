"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromoCampaign } from "../schema";
import { DeleteCampaignDialog } from "./delete-campaign-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const campaign = row.original as PromoCampaign;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const id = campaign.id || campaign._id;

    return (
        <>
            <DeleteCampaignDialog
                campaign={campaign}
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
                    <Link href={`/admin/promotions/campaigns/${id}/edit`}>
                        <DropdownMenuItem className="text-green-500 focus:text-green-500 rounded-none cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4 text-green-500" /> Edit
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/admin/promotions/leads?campaignId=${id}`}>
                        <DropdownMenuItem className="rounded-none cursor-pointer text-black">
                            <Users className="mr-2 h-4 w-4" /> View leads
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
