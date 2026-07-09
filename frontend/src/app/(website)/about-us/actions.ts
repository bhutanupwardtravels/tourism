"use server";

import { getAboutContent as getAboutContentFromDB } from "@/lib/data/about";
import { WhyBhutanItem } from "./schema";

// Static Why Bhutan items (foundational facts that don't need frequent updates)
const whyBhutanItems: WhyBhutanItem[] = [
  {
    id: "gross-national-happiness",
    title: "Gross National Happiness",
    icon: "smile",
    description: "Bhutan measures progress through Gross National Happiness rather than GDP, prioritizing the wellbeing of its people and environment over economic growth alone.",
    order: 1
  },
  {
    id: "pristine-nature",
    title: "Pristine Nature",
    icon: "mountain",
    description: "With 72% forest coverage and a constitutional mandate to maintain at least 60% of the land under forest cover, Bhutan offers some of the world's most pristine landscapes.",
    order: 2
  },
  {
    id: "living-culture",
    title: "Living Culture",
    icon: "heart",
    description: "In Bhutan, culture isn't preserved in museums—it's alive in daily life. From traditional dress to ancient festivals, Bhutanese culture thrives in the modern world.",
    order: 3
  },
  {
    id: "spiritual-heritage",
    title: "Spiritual Heritage",
    icon: "sparkles",
    description: "Buddhism permeates every aspect of Bhutanese life, offering travelers a chance to explore profound spiritual traditions and practices in their authentic context.",
    order: 4
  },
  {
    id: "sustainable-development",
    title: "Sustainable Development",
    icon: "leaf",
    description: "Bhutan's approach to development balances modernization with tradition, proving that progress and preservation can coexist harmoniously.",
    order: 5
  },
  {
    id: "exclusive-access",
    title: "Exclusive Access",
    icon: "key",
    description: "Bhutan's high-value tourism policy means fewer crowds and more meaningful interactions, offering an exclusive and intimate travel experience.",
    order: 6
  }
];

// Main action for fetching about content from database
export async function getAboutContent() {
  try {
    const content = await getAboutContentFromDB();
    return content;
  } catch (error) {
    console.error("Error fetching about content:", error);
    throw new Error("Failed to fetch about content");
  }
}

// Keep Why Bhutan items as static data (not editable via admin)
export async function getWhyBhutanItems(): Promise<WhyBhutanItem[]> {
  try {
    return whyBhutanItems.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching why Bhutan items:", error);
    throw new Error("Failed to fetch why Bhutan items");
  }
}
