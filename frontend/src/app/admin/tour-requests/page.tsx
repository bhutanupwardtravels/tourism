import { getTourRequests } from "./actions";
import { TourRequestsTable } from "./components/tour-requests-table";
import { RequestStatus } from "./types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tour Requests" };

interface TourRequestsPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        status?: string;
        email?: string;
        unread?: string;
    }>;
}

export default async function TourRequestsPage({ searchParams }: TourRequestsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 10;
    const status = params.status ? (params.status.split(",") as RequestStatus[]) : undefined;
    const email = params.email || undefined;
    const unread = params.unread === "true";

    const data = await getTourRequests(page, pageSize, status, email, unread);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    Tour Requests
                </h2>
                <p className="text-sm text-black">
                    Manage incoming traveler inquiries and luxury package requests.
                </p>
            </div>
            <TourRequestsTable
                data={data.items as any}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
