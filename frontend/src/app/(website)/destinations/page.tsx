import { getDestinations } from "./actions";
import { Destination } from "./schema";
import { DestinationsGrid } from "./components/destinations-grid";
import { PageHeader } from "@/components/common/page-header";

export default async function DestinationsPage() {
    const destinations = (await getDestinations()) as Destination[];

    return (
        <div className="min-h-screen bg-white text-black pb-24 overflow-hidden">
            <PageHeader
                label="// explore regions"
                title="Our Destinations"
                description="Mapping the diverse landscapes of Bhutan. From the high alpine valleys of the north to the lush subtropical plains of the south."
                bgText="Regions"
            />

            <div className="container mx-auto px-6">
                <DestinationsGrid destinations={destinations} />
            </div>
        </div>
    );
}
