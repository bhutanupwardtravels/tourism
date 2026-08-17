"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTierAction } from "../actions";
import { LoyaltyTierRow } from "../schema";

interface DeleteTierDialogProps {
    tier: LoyaltyTierRow;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteTierDialog({ tier, open, onOpenChange }: DeleteTierDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteTierAction(tier.minPriorTrips);
            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-none">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-black">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes the{" "}
                        <strong className="text-amber-600">
                            {tier.percent}% from {tier.minPriorTrips} previous trip
                            {tier.minPriorTrips === 1 ? "" : "s"}
                        </strong>{" "}
                        tier. Travellers who qualified through it drop to the next tier down, or to
                        no discount at all.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-none"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 rounded-none"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
