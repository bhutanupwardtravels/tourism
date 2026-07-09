"use client";

import { motion } from "framer-motion";
import { Coffee, Wifi, Car, Tv, Wind, ShieldCheck } from "lucide-react";

interface HotelOverviewProps {
    description: string;
    amenities?: string[];
    rooms?: number;
}

export function HotelOverview({ description, amenities, rooms }: HotelOverviewProps) {
    const amenityIcons: Record<string, any> = {
        wifi: Wifi,
        "free wifi": Wifi,
        coffee: Coffee,
        "tea/coffee": Coffee,
        parking: Car,
        "free parking": Car,
        tv: Tv,
        "satellite tv": Tv,
        ac: Wind,
        "air conditioning": Wind,
    };

    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-4 block font-bold">
                // sanctuary profile
                            </span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                                The <span className="italic font-serif normal-case text-amber-600">Spirit</span> of Your Stay
                            </h2>
                            <div className="relative pl-8 border-l border-black/10">
                                <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                                    "{description}"
                                </p>
                                <div className="mt-8 font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-3 font-bold">
                                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                                    Hospitality Standards Certified // Kingdom of Bhutan
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="p-10 border border-black/5 bg-neutral-50 relative overflow-hidden group"
                        >
                            <h3 className="font-mono text-[13px] font-bold tracking-[0.3em] text-black uppercase mb-12">
                                Available Amenities
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {amenities?.map((amenity, index) => {
                                    const Icon = amenityIcons[amenity.toLowerCase()] || ShieldCheck;
                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="p-3 bg-white border border-black/5 rounded-sm">
                                                <Icon className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <span className="text-sm font-light text-gray-600 uppercase tracking-widest">{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {rooms && (
                                <div className="mt-12 pt-8 border-t border-black/10 flex justify-between items-center">
                                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Available Capacity</span>
                                    <span className="text-2xl font-light tracking-tighter">{rooms} Suites</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
