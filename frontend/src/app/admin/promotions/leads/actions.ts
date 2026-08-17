"use server";

import { getAdminUser as auth } from "@/lib/supabase/server";
import { listLeads as listLeadsData, getLeadsForExport, LeadFilters } from "@/lib/data/promo-leads";
import { getCampaignsForDropdown as getCampaignsForDropdownData } from "@/lib/data/promo-campaigns";
import { countryName } from "@/lib/countries";

export async function listLeads(
    page: number,
    pageSize: number,
    search?: string,
    filters?: LeadFilters
) {
    try {
        return await listLeadsData(page, pageSize, search, filters);
    } catch (error) {
        console.error("Failed to list leads:", error);
        return { items: [], page: 1, page_size: pageSize, total_pages: 0, has_next: false, has_prev: false, total_items: 0 };
    }
}

export async function getCampaignsForDropdown() {
    try {
        return await getCampaignsForDropdownData();
    } catch {
        return [];
    }
}

function csvCell(value: unknown): string {
    const text = value == null ? "" : String(value);
    // Quote everything and double any embedded quotes — names and addresses
    // routinely contain commas.
    return `"${text.replace(/"/g, '""')}"`;
}

/**
 * CSV of the current filter selection, for importing into whatever the operator
 * uses to run the follow-up campaign.
 */
export async function exportLeadsCsv(filters?: LeadFilters) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized", csv: "" };

    try {
        const leads = await getLeadsForExport(filters);

        const header = [
            "Code", "First Name", "Last Name", "Email", "Phone", "Nationality",
            "Discount %", "Issued", "Redeemable From", "Expires", "Redeemed",
        ];

        const rows = leads.map((lead) =>
            [
                lead.code,
                lead.firstName,
                lead.lastName,
                lead.email,
                lead.phone,
                lead.country ? countryName(lead.country) || lead.country : "",
                lead.discountPercent,
                lead.issuedAt ? new Date(lead.issuedAt).toISOString().slice(0, 10) : "",
                lead.eligibleFrom ? new Date(lead.eligibleFrom).toISOString().slice(0, 10) : "",
                lead.expiresAt ? new Date(lead.expiresAt).toISOString().slice(0, 10) : "",
                lead.redeemedAt ? new Date(lead.redeemedAt).toISOString().slice(0, 10) : "",
            ].map(csvCell).join(",")
        );

        return { success: true, message: `${leads.length} leads exported`, csv: [header.map(csvCell).join(","), ...rows].join("\n") };
    } catch (error) {
        console.error("Failed to export leads:", error);
        return { success: false, message: "Failed to export leads", csv: "" };
    }
}
