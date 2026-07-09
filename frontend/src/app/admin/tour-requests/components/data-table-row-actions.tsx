"use client";

import { Row } from "@tanstack/react-table";
import { Eye, Mail, MoreHorizontal, Trash2, CheckCircle2, XCircle, Archive, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { RequestStatus, TourRequest } from "../types";
import { deleteTourRequest, updateTourRequestStatus } from "../actions";

import { useState } from "react";
import { DeleteTourRequestDialog } from "./delete-tour-request-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const request = row.original as TourRequest;

    const onStatusUpdate = async (status: RequestStatus) => {
        const res = await updateTourRequestStatus(request._id!, status);
        if (res.success) {
            toast.success(`Request ${status} successfully`);
        } else {
            toast.error(`Failed to update status: ${res.error}`);
        }
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(request.email);
        toast.success("Email copied to clipboard");
    };

    return (
        <>
            <DeleteTourRequestDialog
                request={request}
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
                <DropdownMenuContent align="end" className="w-[180px] rounded-none">
                    <Link href={`/admin/tour-requests/${request._id}`}>
                        <DropdownMenuItem className="text-blue-500 focus:text-blue-500 data-[variant=default]:text-blue-500 data-[variant=default]:focus:bg-blue-50 rounded-none">
                            <Eye className="mr-2 h-4 w-4 text-blue-500 focus:text-blue-500 data-[variant=default]:text-blue-500" /> View Details
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={copyEmail} className="text-amber-600 focus:text-amber-600 data-[variant=default]:text-amber-600 data-[variant=default]:focus:bg-amber-50 rounded-none">
                        <Mail className="mr-2 h-4 w-4 text-amber-600 focus:text-amber-600 data-[variant=default]:text-amber-600" /> Copy Email
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {request.status !== RequestStatus.APPROVED && (
                        <DropdownMenuItem
                            onClick={() => onStatusUpdate(RequestStatus.APPROVED)}
                            className="text-green-600 focus:text-green-600 data-[variant=default]:text-green-600 data-[variant=default]:focus:bg-green-50 rounded-none"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600 focus:text-green-600 data-[variant=default]:text-green-600" /> Approve
                        </DropdownMenuItem>
                    )}

                    {request.status !== RequestStatus.REJECTED && (
                        <DropdownMenuItem
                            onClick={() => onStatusUpdate(RequestStatus.REJECTED)}
                            className="text-red-600 focus:text-red-600 data-[variant=default]:text-red-600 data-[variant=default]:focus:bg-red-50 rounded-none"
                        >
                            <XCircle className="mr-2 h-4 w-4 text-red-600 focus:text-red-600 data-[variant=default]:text-red-600" /> Reject
                        </DropdownMenuItem>
                    )}

                    {request.status !== RequestStatus.ARCHIVED && (
                        <DropdownMenuItem
                            onClick={() => onStatusUpdate(RequestStatus.ARCHIVED)}
                            className="text-purple-600 focus:text-purple-600 data-[variant=default]:text-purple-600 data-[variant=default]:focus:bg-purple-50 rounded-none"
                        >
                            <Archive className="mr-2 h-4 w-4 text-purple-600 focus:text-purple-600 data-[variant=default]:text-purple-600" /> Archive
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-500 focus:text-red-500 data-[variant=default]:text-red-500 data-[variant=default]:focus:bg-red-50 rounded-none"
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-500 focus:text-red-500 data-[variant=default]:text-red-500" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
