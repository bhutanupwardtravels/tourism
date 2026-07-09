
import { notFound } from "next/navigation";
import { getCostById } from "@/lib/data/settings";
import { updateCostAction } from "../../actions";
import { CostForm } from "../../components/cost-form";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCostPage({ params }: PageProps) {
    const { id } = await params;
    const cost = await getCostById(id);

    if (!cost) {
        notFound();
    }

    return (
        <CostForm
            title="Edit Cost"
            initialData={cost}
            action={updateCostAction.bind(null, id)}
        />
    );
}
