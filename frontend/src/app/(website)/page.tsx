import { Hero } from "@/components/home/hero";
import { getBestHotels } from "./hotels/actions";
import { BestHotels } from "@/components/home/hotels";
import { getTopPriorityTours } from "./tours/actions";
import { Experiences } from "@/components/home/experiences";
import { FeaturedItinerary } from "@/components/home/tours";
import { Destinations } from "@/components/home/destinations";
import CallToAction from "@/components/common/call-to-action";
// import { LuxuryBridge } from "@/components/home/luxury-bridge";
import { CompanyIntro } from "@/components/home/company-intro";
import { getFeaturedDestinations } from "./destinations/actions";
import { ExperienceTypes } from "@/components/home/experience-types";
import { getFeaturedExperiences, getExperienceTypes } from "./experiences/actions";
import { FaqSection } from "@/components/common/faq-section";
import { getFaqContent } from "@/lib/data/faq";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: "Bhutan Tours & Travel Packages",
    description:
        "Curated Bhutan tours, custom itineraries, and boutique stays — plan a fully guided journey through Paro, Thimphu, Punakha, and beyond with local specialists.",
    image: "/images/hero-poster.jpg",
    path: "/",
});

export default async function Home() {
  const [
    featuredTours,
    bestHotels,
    featuredExperiences,
    featuredDestinations,
    experienceTypes,
    faqContent,
  ] = await Promise.all([
    getTopPriorityTours(5),
    getBestHotels(6),
    getFeaturedExperiences(6),
    getFeaturedDestinations(6),
    getExperienceTypes(),
    getFaqContent(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      < Hero />
      <ExperienceTypes experienceTypes={experienceTypes} />
      <FeaturedItinerary itineraries={featuredTours.slice(0, 5)} />
      <Destinations destinations={featuredDestinations} />
      {/* <LuxuryBridge /> */}
      <Experiences experiences={featuredExperiences} />
      <CompanyIntro />
      <BestHotels hotels={bestHotels} />
      <FaqSection
        label="// know before you go"
        title="Bhutan Travel FAQ"
        bgText="FAQ"
        items={faqContent.items.filter((item) => item.homepage)}
        className="border-t border-black/5"
      />
      <CallToAction />
    </div>
  );
}
