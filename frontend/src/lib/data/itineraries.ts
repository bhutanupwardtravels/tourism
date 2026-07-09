export interface Experience {
    title: string;
    description: string;
    image: string;
    category?: string;
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    image?: string;
    accommodation?: string;
    activities?: string[];
    highlights?: string[];
    experiences?: Experience[];
}

export interface Itinerary {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    duration: string;
    price: string;
    days: ItineraryDay[];
}

export const itineraries: Itinerary[] = [
    {
        id: "1",
        slug: "spiritual-discovery-nepal-bhutan",
        title: "Spiritual Discovery: Nepal & Bhutan",
        description:
            "A transformative journey through the spiritual heartlands of the Himalayas. Experience ancient monasteries, vibrant culture, and breathtaking landscapes.",
        image: "https://loremflickr.com/1920/1080/himalayas,monastery?random=10",
        duration: "14 Days",
        price: "From $8,500 pp",
        days: [
            {
                day: 1,
                title: "Arrival in Kathmandu",
                description:
                    "Arrive in the vibrant capital of Nepal. Transfer to your luxury hotel and enjoy a welcome dinner with traditional Nepali cuisine.",
                image: "https://loremflickr.com/800/600/kathmandu?random=11",
                accommodation: "Dwarika's Hotel",
                activities: ["Airport Transfer", "Welcome Dinner"],
                highlights: ["First glimpse of Himalayas", "Traditional Nepali hospitality"],
                experiences: [
                    {
                        title: "Traditional Nepali Dinner",
                        description: "Enjoy a multi-course feast of authentic Nepali dishes accompanied by a cultural dance performance.",
                        image: "https://loremflickr.com/800/600/nepali,food?random=101",
                        category: "Dining",
                    },
                    {
                        title: "Private Rickshaw Tour",
                        description: "Explore the bustling streets of Thamel and the old city on a private rickshaw ride.",
                        image: "https://loremflickr.com/800/600/rickshaw,nepal?random=102",
                        category: "Adventure",
                    },
                ],
            },
            {
                day: 2,
                title: "Kathmandu Valley Exploration",
                description:
                    "Visit the sacred Swayambhunath Stupa and the historic Patan Durbar Square. Immerse yourself in the rich history of the valley.",
                image: "https://loremflickr.com/800/600/temple,nepal?random=12",
                accommodation: "Dwarika's Hotel",
                activities: ["Guided City Tour", "Pottery Workshop in Patan"],
                highlights: ["Swayambhunath Stupa (Monkey Temple)", "Patan Durbar Square"],
            },
            {
                day: 3,
                title: "Fly to Paro, Bhutan",
                description:
                    "Experience one of the world's most spectacular flights over the Himalayas. Arrive in Paro and visit the National Museum.",
                image: "https://loremflickr.com/800/600/paro,airport?random=13",
                accommodation: "COMO Uma Paro",
                activities: ["Flight to Paro", "Museum Visit"],
                highlights: ["Aerial view of Everest", "National Museum of Bhutan"],
            },
            {
                day: 4,
                title: "Thimphu: The Capital",
                description:
                    "Drive to Thimphu. Visit the Buddha Dordenma statue and the Textile Museum. Explore the local markets.",
                image: "https://loremflickr.com/800/600/thimphu,buddha?random=14",
                accommodation: "Amankora Thimphu",
                activities: ["Drive to Thimphu", "Market Walk"],
                highlights: ["Buddha Dordenma", "Royal Textile Academy"],
            },
            {
                day: 5,
                title: "Punakha Dzong",
                description:
                    "Journey over the Dochu La pass with panoramic Himalayan views. Visit the majestic Punakha Dzong, the Palace of Great Happiness.",
                image: "https://loremflickr.com/800/600/punakha,dzong?random=15",
                accommodation: "Six Senses Punakha",
                activities: ["Scenic Drive", "Dzong Tour"],
                highlights: ["Dochu La Pass (108 Chortens)", "Punakha Dzong"],
            },
            {
                day: 6,
                title: "Gangtey Valley",
                description:
                    "Travel to the glacial valley of Phobjikha. Visit the Gangtey Monastery and look for black-necked cranes (seasonal).",
                image: "https://loremflickr.com/800/600/valley,bhutan?random=16",
                accommodation: "Gangtey Lodge",
                activities: ["Nature Walk", "Monastery Visit"],
                highlights: ["Phobjikha Valley", "Black-Necked Cranes"],
            },
            {
                day: 7,
                title: "Return to Paro",
                description:
                    "Drive back to Paro. Enjoy a traditional hot stone bath to relax and rejuvenate.",
                image: "https://loremflickr.com/800/600/spa,bhutan?random=17",
                accommodation: "COMO Uma Paro",
                activities: ["Return Drive", "Hot Stone Bath"],
                highlights: ["Relaxing Evening", "Traditional Wellness"],
            },
            {
                day: 8,
                title: "Tiger's Nest Hike",
                description:
                    "The highlight of the trip: a hike to the iconic Paro Taktsang (Tiger's Nest) Monastery, perched on a cliffside.",
                image: "https://loremflickr.com/800/600/tigersnest?random=18",
                accommodation: "COMO Uma Paro",
                activities: ["Guided Hike", "Farewell Dinner"],
                highlights: ["Paro Taktsang", "Cliffside Views"],
            },
            {
                day: 9,
                title: "Departure",
                description:
                    "Transfer to Paro International Airport for your onward journey, carrying memories of the Kingdom of Happiness.",
                accommodation: "N/A",
                activities: ["Airport Transfer"],
                highlights: ["Final Views of Bhutan"],
            },
        ],
    },
    {
        id: "2",
        slug: "luxury-honeymoon-bhutan",
        title: "Luxury Honeymoon in Bhutan",
        description:
            "The ultimate romantic escape. Private villas, intimate dining, and exclusive cultural experiences in the Land of the Thunder Dragon.",
        image: "https://loremflickr.com/1920/1080/couple,bhutan?random=20",
        duration: "10 Days",
        price: "From $12,000 pp",
        days: [], // Simplified for now
    },
];

export async function getItineraryBySlug(slug: string): Promise<Itinerary | undefined> {
    return itineraries.find((itinerary) => itinerary.slug === slug);
}

export async function getFeaturedItinerary(): Promise<Itinerary> {
    return itineraries[0];
}

export async function getItineraryDay(slug: string, day: number): Promise<{ dayData: ItineraryDay; itinerary: Itinerary } | undefined> {
    const itinerary = itineraries.find((it) => it.slug === slug);
    if (!itinerary) return undefined;

    const dayData = itinerary.days.find((d) => d.day === day);
    if (!dayData) return undefined;

    return { dayData, itinerary };
}

export async function getRelatedItineraries(currentSlug: string): Promise<Itinerary[]> {
    return itineraries.filter((it) => it.slug !== currentSlug).slice(0, 3);
}
