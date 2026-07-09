"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { experienceTypeSchema } from "../schema";
import { DeleteExperienceTypeDialog } from "./delete-experience-type-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const experienceType = experienceTypeSchema.parse(row.original);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteExperienceTypeDialog
                experienceType={experienceType}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="data-[state=open]:bg-muted size-8 rounded-none"
                    >
                        <MoreHorizontal className="text-black" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] rounded-none">
                    <Link href={`/admin/experience-types/${experienceType.id || experienceType._id}/edit`}>
                        <DropdownMenuItem
                            className="text-green-500 focus:text-green-500 data-[variant=default]:text-green-500 data-[variant=default]:focus:bg-green-100 rounded-none"
                        >
                            <Pencil className="mr-2 h-4 w-4 text-green-500 focus:text-green-500 data-[variant=default]:text-green-500" /> Edit
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/admin/experience-types/${experienceType.id || experienceType._id}`}>
                        <DropdownMenuItem
                            className="text-blue-500 focus:text-blue-500 data-[variant=default]:text-blue-500 data-[variant=default]:focus:bg-blue-100 rounded-none"
                        >
                            <Eye className="mr-2 h-4 w-4 text-blue-500 focus:text-blue-500 data-[variant=default]:text-blue-500" /> View
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-500 focus:text-red-500 data-[variant=default]:text-red-500 data-[variant=default]:focus:bg-red-100 rounded-none"
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-500 focus:text-red-500 data-[variant=default]:text-red-500" />  Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
