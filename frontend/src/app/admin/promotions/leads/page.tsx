import { listLeads, getCampaignsForDropdown } from "./actions";
import { LeadsTable } from "./components/leads-table";
import { PromoLead } from "./schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Captured Leads" };

interface LeadsPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        email?: string;
        campaignId?: string;
        country?: string;
        redeemed?: string;
        followUpMonths?: string;
    }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 20;

    const filters = {
        campaignId: params.campaignId || undefined,
        country: params.country || undefined,
        redeemed: params.redeemed || undefined,
        followUpMonths: params.followUpMonths ? Number(params.followUpMonths) : undefined,
    };

    const [data, campaigns] = await Promise.all([
        listLeads(page, pageSize, params.email || "", filters),
        getCampaignsForDropdown(),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">Captured Leads</h2>
                <p className="text-sm text-neutral-500">
                    Everyone who exchanged their details for a discount code. Use the follow-up
                    filter to find people who took a code months ago and never booked.
                </p>
            </div>
            <LeadsTable
                data={data.items as PromoLead[]}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
                campaigns={campaigns}
                filters={filters}
            />
        </div>
    );
}
