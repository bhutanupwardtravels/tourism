"use client";

import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CampaignForm } from "../../components/campaign-form";
import { getCampaign, updateCampaignAction } from "../../actions";
import { PromoCampaign } from "../../schema";

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [campaign, setCampaign] = useState<PromoCampaign | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCampaign(id)
            .then(setCampaign)
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            </div>
        );
    }

    if (!campaign) {
        return <div className="p-8 text-black">Campaign not found.</div>;
    }

    const action = (formData: FormData) => updateCampaignAction(id, formData);

    return <CampaignForm initialData={campaign} action={action} title="Edit Campaign" />;
}
