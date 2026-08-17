import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TierForm } from "../../components/tier-form";
import { getPromoSettingsAction, getTierAction, updateTierAction } from "../../actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Loyalty Tier" };

interface EditTierPageProps {
    params: Promise<{ threshold: string }>;
}

export default async function EditTierPage({ params }: EditTierPageProps) {
    const { threshold } = await params;
    const minPriorTrips = Number(threshold);

    const tier = Number.isInteger(minPriorTrips) ? await getTierAction(minPriorTrips) : null;

    if (!tier) {
        return (
            <div className="flex-1 max-w-3xl mx-auto space-y-4 p-8 pt-6">
                <p className="text-black">Tier not found.</p>
                <Link href="/admin/promotions/loyalty">
                    <Button variant="outline" className="text-black rounded-none">
                        Back to tiers
                    </Button>
                </Link>
            </div>
        );
    }

    const settings = await getPromoSettingsAction();

    // The threshold is the tier's identity, so the original has to travel with
    // the update — editing it moves the row.
    const action = async (formData: FormData) => {
        "use server";
        return updateTierAction(minPriorTrips, formData);
    };

    return (
        <TierForm
            initialData={{ minPriorTrips: tier.minPriorTrips, percent: tier.percent }}
            action={action}
            title="Edit Tier"
            maxPercent={settings.maxPercent}
        />
    );
}
