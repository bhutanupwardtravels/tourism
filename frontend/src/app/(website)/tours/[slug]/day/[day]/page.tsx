import { getTourDay, getAllTours } from "../../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, ChevronLeft, ChevronRight, Clock, ArrowRightLeft, Star, BedDouble, Eye } from "lucide-react";
import { DayHero } from "../../components/day-hero";
import { ExperienceCard } from "@/components/common/experience-card";
import { HotelCard } from "@/components/common/hotel-card";
import { TravelMap } from "@/components/common/travel-map";
import { TourCarousel } from "../../components/tour-carousel";
import CallToAction from "@/components/common/call-to-action";
import { TourBookingCard } from "../../components/tour-booking-card";

interface PageProps {
  params: Promise<{ slug: string; day: string }>;
}

export default async function TourDayPage({ params }: PageProps) {
  const { slug, day } = await params;
  const dayNumber = parseInt(day);
  const data = await getTourDay(slug, dayNumber);

  if (!data) {
    notFound();
  }

  const { dayData, tour, hotel, experiences } = data;
  const allTours = await getAllTours();

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
  const nextDay = dayNumber < tour.days.length ? dayNumber + 1 : null;

  return (
    <div className="min-h-screen bg-white text-black">
      <DayHero
        dayNumber={dayNumber}
        title={dayData.title}
        image={dayData.image || tour.image}
        tourTitle={tour.title}
      />

      {/* Narrative & Protocol Controls */}
      <div className="container mx-auto px-6 pt-24 md:pt-40">
        {/* Superior Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-24">
          <Link
            href={`/tours/${slug}`}
            className="group flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.4em] text-gray-500 hover:text-black transition-all font-bold"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
            [ Back to Main Narrative ]
          </Link>

          <div className="flex items-center gap-8">
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest hidden lg:block font-bold">
              Sequence Registry // Kingdom of Bhutan
            </div>
            <div className="flex bg-black/5 p-1 rounded-xs">
              {prevDay ? (
                <Link
                  href={`/tours/${slug}/day/${prevDay}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-mono border border-black/5 uppercase tracking-widest hover:bg-neutral-50 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </Link>
              ) : (
                <div className="px-6 py-3 text-gray-300 text-[10px] font-mono uppercase tracking-widest cursor-not-allowed">
                  Start
                </div>
              )}
              {nextDay ? (
                <Link
                  href={`/tours/${slug}/day/${nextDay}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-mono border-l-0 border border-black/5 uppercase tracking-widest hover:bg-neutral-50 transition-colors"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </Link>
              ) : (
                <div className="px-6 py-3 text-gray-300 text-[10px] font-mono uppercase tracking-widest border-l-0 border border-black/5 cursor-not-allowed">
                  End
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-48">
          {/* Detailed Briefing */}
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-20">
              <div className="max-w-3xl">
                <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-6 block">
                  // daily briefing log: {dayNumber < 10 ? `0${dayNumber}` : dayNumber}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                  The <span className="italic font-serif normal-case text-amber-600">Experience</span> <br />of {dayData.title}
                </h2>
                <div className="relative pl-12 border-l border-black/10">
                  <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                    "{dayData.description}"
                  </p>
                  <div className="mt-10 font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-3 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Verified Logistics // Sequence Authenticated
                  </div>
                </div>
              </div>

              {/* Protocol Details Grid: Itinerary Items */}
              {dayData.items && dayData.items.length > 0 && (
                <div className="space-y-20">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-black/5" />
                    <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-gray-400">Planned Sequence</h3>
                    <div className="h-px flex-1 bg-black/5" />
                  </div>

                  <div className="space-y-24 relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-black/5 hidden md:block" />

                    {dayData.items.map((item: any, idx: number) => {
                      // Pre-resolve experience object if available
                      const experience = item.type === "experience" && experiences
                        ? experiences.find((e: any) => e._id === item.experienceId)
                        : null;

                      return (
                        <div key={idx} className="relative flex flex-col md:flex-row gap-12 items-start group">
                          {/* Timeline Dot */}
                          <div className="absolute left-[19px] top-6 w-[9px] h-[9px] rounded-full border border-amber-600 bg-white z-10 hidden md:block group-hover:bg-amber-600 transition-colors" />

                          <div className="md:w-16 pt-5">
                            <span className="font-mono text-[10px] text-gray-300 font-bold hidden md:block">
                              [{idx < 9 ? `0${idx + 1}` : idx + 1}]
                            </span>
                          </div>

                          <div className="flex-1 w-full">
                            {item.type === "travel" && !item.hotelId && item.travel ? (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="p-2 bg-blue-50 rounded-full">
                                    <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-600 font-bold">Change Destination</h4>
                                </div>

                                <TravelMap
                                  from={item.travel.from}
                                  to={item.travel.to}
                                  fromCoordinates={item.travel.fromCoordinates}
                                  toCoordinates={item.travel.toCoordinates}
                                />

                                {(item.travel.location || item.travel.timing) && (
                                  <div className="flex gap-8 pt-4 ml-2">
                                    {item.travel.location && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{item.travel.location}</span>
                                      </div>
                                    )}
                                    {item.travel.timing && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{item.travel.timing}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : item.hotelId ? null : (
                              <div className="space-y-8">

                                <h4 className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500 font-bold">
                                  <Eye className="w-4 h-4" /> [ Sightseeing ]
                                </h4>


                                {experience ? (
                                  <div className="w-full">
                                    <ExperienceCard experience={experience} index={idx} className="sm:aspect-video" />
                                  </div>
                                ) : (
                                  <div className="bg-neutral-50/50 p-8 rounded-sm border border-black/5 max-w-sm">
                                    <p className="text-gray-400 italic text-sm">Experience data unavailable</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legacy Activities if no items */}
              {(!dayData.items || dayData.items.length === 0) && dayData.activities && dayData.activities.length > 0 && (
                <div className="bg-white p-16 hover:bg-neutral-50 transition-colors duration-500 group border border-black/5">
                  <h4 className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600 mb-10 font-bold">
                    <MapPin className="w-4 h-4" /> [ Strategic Objectives ]
                  </h4>
                  <ul className="space-y-8">
                    {dayData.activities.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start gap-4 group/item">
                        <span className="font-mono text-[10px] text-gray-300 mt-1">[0{index + 1}]</span>
                        <p className="text-gray-500 leading-relaxed font-light italic group-hover/item:text-black transition-colors duration-300">
                          {activity}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Base Operations (Hotel) */}
              {(hotel || dayData.accommodation) && (
                <div className="mt-16 pt-12 border-t border-black/5">
                  <h4 className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500 mb-10 font-bold">
                    <BedDouble className="w-4 h-4" /> [ Accomodation for the Night ]
                  </h4>

                  {hotel ? (
                    <div className="w-full ">
                      <HotelCard hotel={hotel} index={0} className="sm:aspect-video" />
                    </div>
                  ) : (
                    <div className="bg-black text-white p-12 rounded-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16 transition-transform group-hover:rotate-0" />
                      <div>
                        <span className="text-xs font-mono text-gray-400 block mb-2 uppercase tracking-widest font-bold">
                          Accommodation Verified:
                        </span>
                        <p className="text-3xl font-light italic uppercase tracking-tight">
                          {dayData.accommodation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <TourBookingCard slug={tour.slug} />
        </div>

      </div>
      {/* Similar Journeys */}
      <TourCarousel tours={allTours} currentSlug={slug} />
      <CallToAction />
    </div>
  );
}


