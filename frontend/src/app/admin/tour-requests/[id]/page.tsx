"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequestStatus, TourRequest } from "../types";
import { updateTourRequestStatus, getTourRequestById } from "../actions";
import { getTourById } from "@/app/(website)/tours/actions";
import { Tour } from "@/app/(website)/tours/schema";
import { DeleteTourRequestDialog } from "../components/delete-tour-request-dialog";

// Extracted Components
import { RequestHeader } from "./components/RequestHeader";
import { ContactDetails } from "./components/ContactDetails";
import { PlanDetails } from "./components/PlanDetails";
import { RequestMessage } from "./components/RequestMessage";
import { CustomItineraryView } from "./components/CustomItineraryView";
import { PackageInquiryView } from "./components/PackageInquiryView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TourRequestDetailPage({ params }: PageProps) {
    const [request, setRequest] = useState<TourRequest | null>(null);
    const [tour, setTour] = useState<Tour | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            const data = await getTourRequestById(resolvedParams.id);
            if (!data) {
                notFound();
                return;
            }

            const tr = data as TourRequest;
            setRequest(tr);

            // If it's a package inquiry, fetch the tour details
            if (tr.tourId) {
                try {
                    const tourData = await getTourById(tr.tourId);
                    setTour(tourData);
                } catch (error) {
                    console.error("Failed to fetch tour data:", error);
                }
            }

            setIsLoading(false);
        };
        fetchData();
    }, [params]);

    const onStatusUpdate = async (status: RequestStatus) => {
        if (!request) return;
        const res = await updateTourRequestStatus(request._id!, status);
        if (res.success) {
            toast.success(`Request ${status} successfully`);
            setRequest({ ...request, status });
        } else {
            toast.error(`Failed to update status: ${res.error}`);
        }
    };

    const copyEmail = () => {
        if (!request) return;
        navigator.clipboard.writeText(request.email);
        toast.success("Email copied to clipboard");
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading request details...</div>;
    }

    if (!request) return null;

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto pb-24">
            <DeleteTourRequestDialog
                request={request}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />

            <RequestHeader
                request={request}
                onStatusUpdate={onStatusUpdate}
                onDeleteClick={() => setShowDeleteDialog(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Information Column */}
                <div className="lg:col-span-1 space-y-12">
                    <ContactDetails request={request} onCopyEmail={copyEmail} />
                    <PlanDetails request={request} />
                    <RequestMessage message={request.message} />
                </div>

                {/* Main Content Column */}
                <div className="lg:col-span-3 space-y-8">
                    {request.customItinerary && request.customItinerary.length > 0 ? (
                        <CustomItineraryView request={request} />
                    ) : (
                        <PackageInquiryView tour={tour} />
                    )}
                </div>
            </div>
        </div>
    );
}

