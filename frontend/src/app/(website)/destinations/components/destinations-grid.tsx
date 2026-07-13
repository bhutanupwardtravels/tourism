"use client";

import { motion } from "framer-motion";
import { DestinationCard } from "@/components/common/destination-card";
import { Destination } from "../schema";

interface DestinationsGridProps {
    destinations: Destination[];
}

export function DestinationsGrid({ destinations }: DestinationsGridProps) {
    return (
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
    );
}
