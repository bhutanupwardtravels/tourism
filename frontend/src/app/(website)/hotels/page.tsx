import { getAllHotels } from "./actions";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CallToAction from "@/components/common/call-to-action";
import { HotelsHeader } from "./components/hotels-header";

export default async function HotelsPage() {
    const hotels = await getAllHotels();

    return (
        <div className="min-h-screen bg-white text-black overflow-hidden">
            <HotelsHeader />

            <div className="container mx-auto px-6 pb-40">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-black/5 pb-12 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-light tracking-tighter uppercase mb-2">
                            The <span className="italic font-serif normal-case">Hospitality</span> Collection
                        </h2>
                        <p className="text-gray-500 font-light italic">
                            "A curated selection of sanctuaries offering authentic Bhutanese hospitality."
                        </p>
                    </div>
                    <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest text-right">
                        Total Sanctuaries: {hotels.length} // BHU-HOTEL-2025
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    {hotels.map((hotel, index) => (
                        <Link
                            key={hotel.id}
                            href={`/hotels/${hotel.slug}`}
                            className="group relative"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-neutral-100 border border-black/5 mb-8">
                                <img
                                    src={hotel.image}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover transition-all duration-1000 saturate-[0.8] group-hover:saturate-[1.2] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-700" />
                                <div className="absolute inset-0 bg-linear-to-t from-white via-white/5 to-transparent opacity-60 group-hover:opacity-10 transition-opacity duration-700" />

                                <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                                    <span className="bg-black text-white px-3 py-1 font-mono text-[8px] uppercase tracking-[0.4em] z-20">
                                        {hotel.priceRange} Luxury
                                    </span>
                                </div>

                                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                                    <span className="h-px w-10 bg-amber-500" />
                                    <span className="font-mono text-[10px] text-white uppercase tracking-[0.2em] font-bold drop-shadow-md">
                                        Verified Stay // BHU-HOT
                                    </span>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-0.5 h-3 ${i < hotel.rating ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-black/10"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="w-1 h-1 bg-black/20 rounded-full" />
                                        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                            {hotel.location || "Bhutan"}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-light tracking-tighter text-black group-hover:italic transition-all duration-500 line-clamp-2 uppercase">
                                        {hotel.name}
                                    </h3>
                                </div>

                                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:border-amber-500 transition-colors ml-4 shrink-0">
                                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            </div>

                            <p className="mt-6 text-gray-500 font-light leading-relaxed line-clamp-2 italic text-sm">
                                "{hotel.description}"
                            </p>

                            {/* Decorative ID */}
                            <div className="absolute top-0 -right-4 font-mono text-[8px] tracking-[0.6em] text-gray-300 rotate-90 origin-top-left py-4 border-l border-black/5 uppercase">
                                ID // {hotel.id.slice(-6).toUpperCase()}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <CallToAction />
        </div>
    );
}
