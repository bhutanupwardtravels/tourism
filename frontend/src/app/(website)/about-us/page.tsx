import {
  getAboutContent,
  getWhyBhutanItems,
} from "./actions";
import { AboutHero } from "./components/about-hero";
import { OurStory } from "./components/our-story";
import { OurMission } from "./components/our-mission";
import { OurPurpose } from "./components/our-purpose";
import { SustainableTravel } from "./components/sustainable-travel";
import { WhyBhutan } from "./components/why-bhutan";
import CallToAction from "@/components/common/call-to-action";

export default async function AboutPage() {
  // Fetch the main about content that matches admin structure
  const aboutContent = await getAboutContent();

  // Transform simple data to component props format
  const heroProps = {
    title: aboutContent.hero.title.toUpperCase(),
    subtitle: aboutContent.hero.subtitle,
    description: aboutContent.hero.content,
    backgroundImage: aboutContent.hero.image,
  };

  const storyProps = {
    id: "our-story",
    title: aboutContent.story.title,
    subtitle: aboutContent.story.subtitle,
    content: aboutContent.story.content.split("\n\n").filter((p: string) => p.trim()),
    image: aboutContent.story.image,
    order: 1,
  };

  const purposeProps = {
    id: "our-purpose",
    title: aboutContent.purpose.title,
    subtitle: aboutContent.purpose.subtitle,
    content: aboutContent.purpose.content.split("\n\n").filter((p: string) => p.trim()),
    image: aboutContent.purpose.image,
    order: 2,
  };

  // Fetch additional structured data for Why Bhutan section
  const whyBhutan = await getWhyBhutanItems();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <AboutHero hero={heroProps} />
      <div className="relative">
        <OurStory story={storyProps} />
        <OurMission items={aboutContent.mission.items} subtitle={aboutContent.mission.subtitle} />
        <OurPurpose purpose={purposeProps} />
        <SustainableTravel
          items={aboutContent.sustainable.items}
          intro={aboutContent.sustainable.intro}
          subtitle={aboutContent.sustainable.subtitle}
        />
        <WhyBhutan items={whyBhutan} />
      </div>
      <CallToAction />
    </main>
  );
}
