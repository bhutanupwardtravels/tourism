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

export default async function Home() {
  const featuredTours = await getTopPriorityTours(5);
  const bestHotels = await getBestHotels(6);
  const featuredExperiences = await getFeaturedExperiences(6);
  const featuredDestinations = await getFeaturedDestinations(6);
  const experienceTypes = await getExperienceTypes();

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
      <CallToAction />
    </div>
  );
}
