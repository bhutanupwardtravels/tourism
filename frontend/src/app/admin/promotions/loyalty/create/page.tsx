import { TierForm } from "../components/tier-form";
import { createTierAction, getPromoSettingsAction } from "../actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Loyalty Tier" };

export default async function CreateTierPage() {
    const settings = await getPromoSettingsAction();

    return (
        <TierForm action={createTierAction} title="New Tier" maxPercent={settings.maxPercent} />
    );
}
