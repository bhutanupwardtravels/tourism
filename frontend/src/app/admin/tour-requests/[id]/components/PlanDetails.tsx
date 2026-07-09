"use client";

import { format, isValid } from "date-fns";
import { TourRequest } from "../../types";

interface PlanDetailsProps {
    request: TourRequest;
}

const formatDate = (dateStr: string | any, formatStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (!isValid(date)) return "N/A";
    return format(date, formatStr);
};

export function PlanDetails({ request }: PlanDetailsProps) {
    return (
        <div className="space-y-8 pt-8 border-t border-gray-200">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                Plan Details
            </h3>
            <div className="space-y-6">
                <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Travel Date</span>
                    <span className="text-black font-semibold flex items-center gap-2 text-sm">
                        {formatDate(request.travelDate, "EEEE, MMM dd, yyyy")}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Group Size</span>
                    <span className="text-black font-semibold text-sm">{request.travelers} Travelers</span>
                </div>
                <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Package Interest</span>
                    <span className="text-amber-600 font-bold block uppercase tracking-tight text-sm">
                        {request.tourName || request.destination || "Custom Luxe Experience"}
                    </span>
                </div>
            </div>
        </div>
    );
}
