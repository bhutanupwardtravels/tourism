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
import { Testimonials } from "@/components/home/testimonials";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { getAboutContent } from "@/lib/data/about";

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
    testimonials,
    about,
  ] = await Promise.all([
    getTopPriorityTours(6),
    getBestHotels(6),
    getFeaturedExperiences(6),
    getFeaturedDestinations(6),
    getExperienceTypes(),
    getFaqContent(),
    getFeaturedTestimonials(9),
    // Only used for the hero trust strip; a missing About row must not 500 the homepage.
    getAboutContent().catch(() => null),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero
        licenseNumber={about?.credentials.licenseNumber || undefined}
        foundingYear={about?.credentials.foundingYear || undefined}
        reviewCount={testimonials.length}
      />
      {/* Bookable, priced products first — the philosophy reads after, not before. */}
      <FeaturedItinerary itineraries={featuredTours} />
      <CompanyIntro />
      <ExperienceTypes experienceTypes={experienceTypes} />
      <Destinations destinations={featuredDestinations} />
      {/* <LuxuryBridge /> */}
      <Experiences experiences={featuredExperiences} />
      <BestHotels hotels={bestHotels} />
      <Testimonials testimonials={testimonials} />
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
