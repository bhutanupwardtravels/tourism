import { getPromoSettingsAction } from "../actions";
import { LoyaltySettingsForm } from "../components/settings-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Loyalty Settings" };

export default async function LoyaltySettingsPage() {
    const settings = await getPromoSettingsAction();

    return (
        <LoyaltySettingsForm
            initialData={{
                loyaltyEnabled: settings.loyaltyEnabled,
                maxPercent: settings.maxPercent,
                teaserText: settings.teaserText,
            }}
            updatedAt={settings.updatedAt}
        />
    );
}
