import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import EnquireClient from "./components/enquire-client";

export const metadata: Metadata = buildMetadata({
    title: "Enquire | Start Your Bhutan Journey",
    description:
        "Tell us about your travel dates, group size, and interests — our specialists respond within 24 hours to begin designing your Bhutan itinerary.",
    path: "/enquire",
});

export default function EnquirePage() {
    return <EnquireClient />;
}
