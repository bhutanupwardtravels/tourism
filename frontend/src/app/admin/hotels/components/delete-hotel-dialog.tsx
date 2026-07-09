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
import { deleteHotel } from "../actions";
import { Hotel } from "../schema";

interface DeleteHotelDialogProps {
  hotel: Hotel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteHotelDialog({
  hotel,
  open,
  onOpenChange,
}: DeleteHotelDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const id = hotel.id || hotel._id;
    if (!id) {
      toast.error("Hotel ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteHotel(id);
      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
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
          <AlertDialogDescription >
            This action cannot be undone. This will permanently delete the
            hotel <strong className="text-amber-600">{hotel.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-none">Cancel</AlertDialogCancel>
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
