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
import { deleteTestimonial } from "../actions";
import { Testimonial } from "../schema";

interface DeleteTestimonialDialogProps {
    testimonial: Testimonial;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteTestimonialDialog({ testimonial, open, onOpenChange }: DeleteTestimonialDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const id = testimonial.id || testimonial._id;
        if (!id) {
            toast.error("Testimonial ID is missing");
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteTestimonial(id);
            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
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
                        This action cannot be undone. This will permanently delete the testimonial from{" "}
                        <strong className="text-amber-600">{testimonial.name}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-none">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
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
