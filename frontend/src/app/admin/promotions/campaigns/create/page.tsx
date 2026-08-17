"use client";

import { CampaignForm } from "../components/campaign-form";
import { createCampaignAction } from "../actions";

export default function CreateCampaignPage() {
    return <CampaignForm action={createCampaignAction} title="New Campaign" />;
}
