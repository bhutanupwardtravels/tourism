"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourRequest } from "../../types";

interface ContactDetailsProps {
    request: TourRequest;
    onCopyEmail: () => void;
}

export function ContactDetails({ request, onCopyEmail }: ContactDetailsProps) {
    return (
        <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                Contact Details
            </h3>

            <div className="space-y-6">
                <div className="group relative">
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Email</span>
                    <div className="flex items-center justify-between">
                        <a href={`mailto:${request.email}`} className="text-black font-semibold hover:text-amber-600 transition-colors break-all text-sm underline decoration-gray-200 underline-offset-4">
                            {request.email}
                        </a>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-black" onClick={onCopyEmail}>
                            <Copy className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
                <div className="group relative">
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Phone</span>
                    <span className="text-black font-semibold text-sm">{request.phone || "Not Provided"}</span>
                </div>
            </div>
        </div>
    );
}
