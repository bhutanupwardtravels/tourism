"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DestinationCard } from "@/components/common/destination-card";
import { getDestinations } from "./actions";
import { Destination } from "./schema";

import { PageHeader } from "@/components/common/page-header";

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        getDestinations().then((data) => setDestinations(data as Destination[]));
    }, []);

    return (
        <div className="min-h-screen bg-white text-black pb-24 overflow-hidden">
            <PageHeader
                label="// explore regions"
                title="Our Destinations"
                description="Mapping the diverse landscapes of Bhutan. From the high alpine valleys of the north to the lush subtropical plains of the south."
                bgText="Regions"
            />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
                    {destinations.map((dest, index) => (
                        <motion.div
                            key={dest.slug}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index % 2 * 0.2 }}
                        >
                            <DestinationCard destination={dest} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
