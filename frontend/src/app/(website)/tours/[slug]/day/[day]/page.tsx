import { getTourDay, getAllTours } from "../../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, ArrowRightLeft, BedDouble, Eye } from "lucide-react";
import { DayHero } from "../../components/day-hero";
import { ExperienceCard } from "@/components/common/experience-card";
import { HotelCard } from "@/components/common/hotel-card";
import { TravelMap } from "@/components/common/travel-map";
import { DayNav } from "../../components/day-nav";
import { TourCarousel } from "../../components/tour-carousel";
import CallToAction from "@/components/common/call-to-action";
import { JsonLd } from "@/components/common/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";

import type { ResolvedExperience } from "@/lib/data/experiences";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string; day: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, day } = await params;
  const dayNumber = parseInt(day);
  const data = await getTourDay(slug, dayNumber);
  if (!data) return {};

  const { dayData, tour } = data;
  return buildMetadata({
    title: `Day ${dayNumber} — ${tour.title}`,
    description: dayData.description,
    image: dayData.image || tour.image,
    path: `/tours/${slug}/day/${dayNumber}`,
  });
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

  // The admin builds one ordered list per day — travel legs, sightseeing, and
  // the night's stay all live in `items` in the order they happen. The stay was
  // previously pulled out of that list and rendered in its own block below,
  // which both broke the ordering and left an empty numbered slot where it had
  // been. Normalise everything into a single sequence so the page renders the
  // day in the order the traveller lives it.
  const rawItems = dayData.items ?? [];
  const stayIsInItems = rawItems.some((item) => item.hotelId);

  type Step =
    | { kind: "travel"; title: string; travel: NonNullable<(typeof rawItems)[number]["travel"]> }
    | { kind: "experience"; title: string; experience: ResolvedExperience | null }
    | { kind: "stay"; title: string };

  // "Entry Point" is a sentinel the tour builder writes for a tour's arrival leg
  // (see the admin tour form), not a place name — so that leg has to read as
  // starting somewhere rather than travelling from nowhere.
  const travelTitle = (from?: string, to?: string) => {
    const origin = from?.trim();
    const destination = to?.trim();
    if (!destination) return "Travel";
    if (!origin || origin === "Entry Point" || origin === destination) {
      return `Start at ${destination}`;
    }
    return `Travel from ${origin} to ${destination}`;
  };

  const stayName = hotel?.name || dayData.accommodation;
  const stayTitle = stayName ? `Spend the night at ${stayName}` : "Spend the night";

  const sequence: Step[] = rawItems.map((item) => {
    if (item.hotelId) return { kind: "stay", title: stayTitle } as const;
    if (item.type === "travel" && item.travel) {
      return {
        kind: "travel",
        title: travelTitle(item.travel.from, item.travel.to),
        travel: item.travel,
      } as const;
    }
    const experience =
      (item.type === "experience" && experiences
        ? experiences.find((e) => e._id === item.experienceId)
        : null) ?? null;
    return {
      kind: "experience",
      title: experience?.title || "Sightseeing",
      experience,
    } as const;
  });

  // A stay recorded at day level (rather than as an item) still belongs at the
  // end of the day, which is when the traveller reaches it.
  if (!stayIsInItems && (hotel || dayData.accommodation)) {
    sequence.push({ kind: "stay", title: stayTitle });
  }

  const stepNumber = (i: number) => (i < 9 ? `0${i + 1}` : `${i + 1}`);


  return (
    <div className="min-h-screen bg-white text-black">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tours", path: "/tours" },
          { name: tour.title, path: `/tours/${slug}` },
          { name: `Day ${dayNumber}`, path: `/tours/${slug}/day/${dayNumber}` },
        ])}
      />
      <DayHero
        dayNumber={dayNumber}
        title={dayData.title}
        image={dayData.image || tour.image}
        tourTitle={tour.title}
      />

      {/* Top padding tracks the tour page's `pt-20`, split either side of the
          back link, so a day opens on the same rhythm as the itinerary it came
          from rather than after a screen of empty white. */}
      <div className="container mx-auto px-6 pt-12 md:pt-16">
        {/* One way out of a day page, on the left where a back control belongs.
            Moving between days is handled by the day cards at the foot of the
            page, where someone actually finishes reading. */}
        <div className="pb-12">
          <Link
            href={`/tours/${slug}`}
            className="group inline-flex items-center gap-3 border border-black/15 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition-colors hover:border-amber-600 hover:text-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to the full itinerary
          </Link>
        </div>

        <div className="mb-48">
          {/* Day narrative */}
          <div className="flex flex-col gap-20">
              <div className="max-w-3xl">
                <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-6 block">
                  {`// day ${dayNumber < 10 ? `0${dayNumber}` : dayNumber}`}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                  About this <span className="italic font-serif normal-case text-amber-600">day</span>
                </h2>
                <div className="relative pl-8 border-l border-black/10">
                  <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                    &quot;{dayData.description}&quot;
                  </p>
                </div>
              </div>

              {/* Planned sequence — travel, sightseeing and the night's stay,
                  in the order the day actually happens. */}
              {sequence.length > 0 && (
                <div>
                  <div className="max-w-3xl mb-16">
                    <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block">
                      {"// planned sequence"}
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight uppercase">
                      Step by <span className="italic font-serif normal-case text-amber-600">step</span>
                    </h2>
                  </div>

                  <ol className="relative space-y-16">
                    {/* Spine: sits behind the dots, inset by half a dot so the
                        two line up on the same axis. */}
                    <div
                      aria-hidden
                      className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-black/10 md:block"
                    />

                    {sequence.map((step, idx) => (
                      <li key={idx} className="relative md:pl-16">
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 hidden h-[15px] w-[15px] rounded-full border border-amber-600 bg-white md:block"
                        />

                        <div className="mb-6 max-w-3xl">
                          <div className="mb-3 flex items-center gap-4">
                            <span className="font-mono text-xs font-bold text-gray-400">
                              {stepNumber(idx)}
                            </span>
                            <span className="h-px w-6 bg-black/10" />
                            <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber-600">
                              {step.kind === "travel" && (
                                <>
                                  <ArrowRightLeft className="h-3.5 w-3.5" /> Travel
                                </>
                              )}
                              {step.kind === "experience" && (
                                <>
                                  <Eye className="h-3.5 w-3.5" /> Sightseeing
                                </>
                              )}
                              {step.kind === "stay" && (
                                <>
                                  <BedDouble className="h-3.5 w-3.5" /> Tonight&apos;s stay
                                </>
                              )}
                            </span>
                          </div>

                          {/* The card art carries the mood; this line carries the
                              fact. Reading only these down the page should tell you
                              what the day actually consists of. */}
                          <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black">
                            {step.title}
                          </h3>
                        </div>

                        {/* One measure for every step so the sequence reads as a
                            column rather than a stack of differently-sized slabs. */}
                        <div className="max-w-3xl">
                          {step.kind === "travel" && (
                            <div className="space-y-4">
                              <TravelMap
                                from={step.travel.from}
                                to={step.travel.to}
                                fromCoordinates={step.travel.fromCoordinates}
                                toCoordinates={step.travel.toCoordinates}
                              />
                              {(step.travel.location || step.travel.timing) && (
                                <div className="flex flex-wrap gap-x-8 gap-y-2">
                                  {step.travel.location && (
                                    <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500">
                                      <MapPin className="h-3 w-3 text-gray-400" />
                                      {step.travel.location}
                                    </span>
                                  )}
                                  {step.travel.timing && (
                                    <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500">
                                      <Clock className="h-3 w-3 text-gray-400" />
                                      {step.travel.timing}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {step.kind === "experience" &&
                            (step.experience ? (
                              <ExperienceCard
                                experience={step.experience}
                                index={idx}
                                className="sm:aspect-video"
                              />
                            ) : (
                              <div className="border border-black/5 bg-neutral-50/50 p-8">
                                <p className="text-sm italic text-gray-400">
                                  Experience data unavailable
                                </p>
                              </div>
                            ))}

                          {step.kind === "stay" &&
                            (hotel ? (
                              <HotelCard hotel={hotel} className="sm:aspect-video" />
                            ) : (
                              <div className="border border-black/10 p-8">
                                <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
                                  Accommodation
                                </span>
                                <p className="text-2xl font-light uppercase tracking-tight">
                                  {dayData.accommodation}
                                </p>
                              </div>
                            ))}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Legacy Activities if no items */}
              {(!dayData.items || dayData.items.length === 0) && dayData.activities && dayData.activities.length > 0 && (
                <div className="bg-white p-16 hover:bg-neutral-50 transition-colors duration-500 group border border-black/5">
                  <h4 className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.4em] text-amber-600 mb-10 font-bold">
                    <MapPin className="w-4 h-4" /> What you&apos;ll do
                  </h4>
                  <ul className="space-y-8">
                    {dayData.activities.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start gap-4 group/item">
                        <span className="font-mono text-xs text-gray-300 mt-1">[0{index + 1}]</span>
                        <p className="text-gray-500 leading-relaxed font-light italic group-hover/item:text-black transition-colors duration-300">
                          {activity}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>

        {/* Where the day ends: step to the one either side of it. Looked up by
            day number rather than array position, the same way getTourDay
            resolves the current one. */}
        <DayNav
          slug={slug}
          prev={tour.days.find((d) => d.day === prevDay)}
          next={tour.days.find((d) => d.day === nextDay)}
          fallbackImage={tour.image}
        />
      </div>

      {/* Similar Journeys */}
      <TourCarousel tours={allTours} currentSlug={slug} />
      <CallToAction packageSlug={slug} />
    </div>
  );
}


