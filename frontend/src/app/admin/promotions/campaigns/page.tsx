import { listCampaigns } from "./actions";
import { CampaignsTable } from "./components/campaigns-table";
import { PromoCampaign } from "./schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Discount Campaigns" };

interface CampaignsPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        name?: string;
        isActive?: string;
    }>;
}

export default async function CampaignsPage({ searchParams }: CampaignsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 10;

    const data = await listCampaigns(page, pageSize, params.name || "", {
        isActive: params.isActive || "",
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    Discount Campaigns
                </h2>
                <p className="text-sm text-neutral-500">
                    Time-boxed offers shown as a banner on the public site. Visitors exchange
                    their contact details for a discount code they can redeem later.
                </p>
            </div>
            <CampaignsTable
                data={data.items as PromoCampaign[]}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
