
import { createCostAction } from "../actions";
import { CostForm } from "../components/cost-form";

export default function CreateCostPage() {
    return <CostForm title="Add New Cost" action={createCostAction} />;
}
