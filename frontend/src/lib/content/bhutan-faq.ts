export interface FaqItem {
    question: string;
    answer: string;
}

// Self-contained 40-60 word answers so each entry reads correctly on its own
// when extracted by AI search/answer engines, independent of surrounding page context.
export const bhutanFaqs: FaqItem[] = [
    {
        question: "What is the Sustainable Development Fee (SDF) for Bhutan?",
        answer:
            "The SDF is a mandatory government fee charged per person, per night, for all international tourists visiting Bhutan. As of 2026 it is US$100 per night, reduced from US$200, and this rate is set to run through August 31, 2027. It funds free healthcare, education, and environmental conservation.",
    },
    {
        question: "How much does a Bhutan tour package cost?",
        answer:
            "Bhutan tour packages typically range from US$250 to US$2,000 per person per night depending on accommodation and service level, on top of the US$100/night SDF. A standard 5-day guided tour with private transport, a licensed guide, meals, and monument fees commonly runs around US$1,500-1,700 per person.",
    },
    {
        question: "Do I need a visa to visit Bhutan?",
        answer:
            "Yes. All foreign tourists (except Indian, Bangladeshi, and Maldivian nationals) need a visa, arranged in advance through a licensed Bhutanese tour operator like Bhutan Upward Travels. The operator submits your documents, pays the visa fee, and secures approval before you travel; you cannot apply for a Bhutan tourist visa directly on your own.",
    },
    {
        question: "What is the best time to visit Bhutan?",
        answer:
            "Spring (March-May) and autumn (September-November) are the best times to visit Bhutan, with clear skies, mountain views, and major festivals (tshechus) like Paro and Thimphu. Winter (December-February) offers fewer crowds and lower haze, while the summer monsoon (June-August) brings rain but lush landscapes.",
    },
    {
        question: "How many days do I need for a Bhutan trip?",
        answer:
            "Most first-time visitors spend 5-7 days in Bhutan, enough to cover Paro, Thimphu, and Punakha, including the hike to Tiger's Nest Monastery. Shorter 3-4 day trips can cover Paro and Thimphu only, while 10+ day itineraries add central Bhutan (Bumthang) or trekking routes.",
    },
    {
        question: "Do I need a licensed guide to travel in Bhutan?",
        answer:
            "Yes. Bhutan requires all international tourists to travel with a licensed Bhutanese guide for the duration of their trip, arranged through an authorized tour operator. The guide accompanies you at all sites outside Paro and Thimphu town centers and is included in standard tour package pricing.",
    },
    {
        question: "What currency is used in Bhutan and how do I pay for a tour?",
        answer:
            "Bhutan's currency is the Ngultrum (BTN), pegged 1:1 to the Indian Rupee, though US dollars are widely accepted for tourism payments. Tour packages, including the SDF, are typically paid in USD by bank transfer to the licensed tour operator before or upon arrival; carry cash for small personal purchases.",
    },
    {
        question: "Can I travel to Bhutan independently, without a tour operator?",
        answer:
            "No, independent tourism is not possible in Bhutan for most international visitors. Bhutan requires tourists to book through a licensed local tour operator, which arranges the visa, licensed guide, transport, and accommodation as a package. Indian, Bangladeshi, and Maldivian nationals have more flexibility but still need permits for many regions.",
    },
    {
        question: "What should I pack for a trip to Bhutan, and is altitude a concern?",
        answer:
            "Pack layered clothing for temperature swings between 1,200m (Phuntsholing) and over 3,000m (Paro, Dochula Pass), sturdy hiking shoes for sites like Tiger's Nest, and modest clothing for temples (shoulders and knees covered). Altitude sickness is uncommon below 3,500m but possible on trekking routes; acclimatize gradually and stay hydrated.",
    },
    {
        question: "How far in advance should I book a Bhutan tour?",
        answer:
            "Book 2-4 months ahead for standard travel, and 6+ months ahead for festival season (spring and autumn tshechus) when flights and hotels fill quickly. Bhutan has only two airlines serving Paro International Airport, so flight availability, not tour operator capacity, is usually the earliest constraint.",
    },
];

// Condensed subset for the homepage FAQ block.
export const homeFaqs: FaqItem[] = [
    bhutanFaqs[0], // SDF
    bhutanFaqs[1], // cost
    bhutanFaqs[2], // visa
    bhutanFaqs[3], // best time
    bhutanFaqs[4], // days needed
    bhutanFaqs[5], // guide requirement
];
