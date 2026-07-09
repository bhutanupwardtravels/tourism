export interface Package {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    duration: string;
    price: string;
    included: string[];
    highlights: string[];
    destinations: string[];
    experiences: string[];
}

export interface Hotel {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    location: string;
    category: "Luxury" | "Boutique" | "Heritage" | "Resort";
    pricePerNight: string;
    amenities: string[];
    rating: number;
}

export const packages: Package[] = [
    {
        id: "1",
        slug: "cultural-immersion",
        name: "Cultural Immersion",
        description: "Dive deep into Bhutan's rich cultural heritage with visits to ancient monasteries, traditional festivals, and local communities.",
        image: "https://loremflickr.com/800/600/bhutan,culture?random=30",
        duration: "7 Days",
        price: "From $4,500 pp",
        included: [
            "Luxury accommodation",
            "All meals",
            "Private guide",
            "Airport transfers",
            "Festival tickets",
            "Cultural workshops"
        ],
        highlights: [
            "Attend a traditional Tshechu festival",
            "Private monastery visits",
            "Traditional arts and crafts workshops",
            "Home-cooked meal with a local family"
        ],
        destinations: ["Thimphu", "Paro", "Punakha"],
        experiences: ["festivals", "tiger-nest-hike"]
    },
    {
        id: "2",
        slug: "adventure-seeker",
        name: "Adventure Seeker",
        description: "For thrill-seekers and outdoor enthusiasts. Trek through pristine valleys, raft wild rivers, and conquer mountain passes.",
        image: "https://loremflickr.com/800/600/trekking,mountains?random=31",
        duration: "10 Days",
        price: "From $6,800 pp",
        included: [
            "Camping equipment",
            "Experienced trekking guide",
            "All meals during trek",
            "Porter services",
            "Safety equipment",
            "Pre and post-trek accommodation"
        ],
        highlights: [
            "Multi-day Himalayan trek",
            "White-water rafting",
            "Mountain biking",
            "Rock climbing sessions"
        ],
        destinations: ["Paro", "Bumthang", "Gangtey"],
        experiences: ["snowman-trek", "tiger-nest-hike", "nature"]
    },
    {
        id: "3",
        slug: "wellness-retreat",
        name: "Wellness & Rejuvenation",
        description: "Restore balance to your mind, body, and spirit with traditional healing practices, meditation, and spa treatments.",
        image: "https://loremflickr.com/800/600/spa,wellness?random=32",
        duration: "5 Days",
        price: "From $3,200 pp",
        included: [
            "Luxury spa resort",
            "Daily yoga and meditation",
            "Traditional hot stone baths",
            "Organic meals",
            "Wellness consultations",
            "Spa treatments"
        ],
        highlights: [
            "Traditional hot stone bath therapy",
            "Guided meditation with monks",
            "Yoga in mountain settings",
            "Herbal healing sessions"
        ],
        destinations: ["Thimphu", "Punakha"],
        experiences: ["wellness", "hot-stone-bath"]
    },
    {
        id: "4",
        slug: "luxury-escape",
        name: "Luxury Escape",
        description: "Experience Bhutan in ultimate comfort with five-star accommodations, private tours, and exclusive experiences.",
        image: "https://loremflickr.com/800/600/luxury,resort?random=33",
        duration: "12 Days",
        price: "From $15,000 pp",
        included: [
            "Five-star accommodations",
            "Private helicopter tours",
            "Personal butler service",
            "Michelin-level dining",
            "Exclusive cultural experiences",
            "Private jet transfers available"
        ],
        highlights: [
            "Helicopter tour of Himalayas",
            "Private audience with monks",
            "Exclusive festival viewing",
            "Luxury camping under stars"
        ],
        destinations: ["Paro", "Thimphu", "Punakha", "Bumthang", "Gangtey"],
        experiences: ["wellness", "festivals", "nature", "tiger-nest-hike"]
    },
    {
        id: "5",
        slug: "family-adventure",
        name: "Family Adventure",
        description: "Create lasting memories with experiences designed for families. Kid-friendly activities and comfortable accommodations.",
        image: "https://loremflickr.com/800/600/family,travel?random=34",
        duration: "8 Days",
        price: "From $4,000 pp",
        included: [
            "Family-friendly hotels",
            "Kid-appropriate activities",
            "Family guide",
            "All meals",
            "Educational workshops",
            "Airport transfers"
        ],
        highlights: [
            "Archery lessons",
            "Traditional cooking class",
            "Easy nature walks",
            "Visit to local schools"
        ],
        destinations: ["Paro", "Thimphu", "Punakha"],
        experiences: ["festivals", "nature"]
    }
];

export const hotels: Hotel[] = [
    {
        id: "1",
        slug: "amankora-paro",
        name: "Amankora Paro",
        description: "Luxury resort nestled in a pine forest with stunning views of the Paro valley and surrounding Himalayas.",
        image: "https://loremflickr.com/800/600/luxury,resort,bhutan?random=40",
        location: "Paro",
        category: "Luxury",
        pricePerNight: "From $1,200",
        amenities: [
            "Spa & Wellness Center",
            "Fine Dining Restaurant",
            "Heated Pool",
            "Library",
            "Private Balconies",
            "Butler Service"
        ],
        rating: 5
    },
    {
        id: "2",
        slug: "como-uma-paro",
        name: "COMO Uma Paro",
        description: "Contemporary luxury hotel offering holistic wellness experiences and adventure activities.",
        image: "https://loremflickr.com/800/600/hotel,mountains?random=41",
        location: "Paro",
        category: "Luxury",
        pricePerNight: "From $800",
        amenities: [
            "COMO Shambhala Spa",
            "Yoga Studio",
            "Outdoor Pool",
            "Gourmet Restaurant",
            "Adventure Center",
            "Mountain Views"
        ],
        rating: 5
    },
    {
        id: "3",
        slug: "six-senses-punakha",
        name: "Six Senses Punakha",
        description: "Eco-luxury lodge with panoramic views of the Mo Chhu River and Punakha Valley.",
        image: "https://loremflickr.com/800/600/eco,lodge?random=42",
        location: "Punakha",
        category: "Resort",
        pricePerNight: "From $950",
        amenities: [
            "Six Senses Spa",
            "Organic Farm",
            "Infinity Pool",
            "Multiple Restaurants",
            "Cinema",
            "Kids Club"
        ],
        rating: 5
    },
    {
        id: "4",
        slug: "gangtey-lodge",
        name: "Gangtey Lodge",
        description: "Boutique lodge overlooking the pristine Phobjikha Valley, winter home of black-necked cranes.",
        image: "https://loremflickr.com/800/600/lodge,valley?random=43",
        location: "Gangtey",
        category: "Boutique",
        pricePerNight: "From $600",
        amenities: [
            "Valley Views",
            "Traditional Architecture",
            "Cozy Fireplaces",
            "Local Cuisine",
            "Nature Trails",
            "Bird Watching"
        ],
        rating: 4
    },
    {
        id: "5",
        slug: "zhiwa-ling-heritage",
        name: "Zhiwa Ling Heritage",
        description: "Traditional Bhutanese palace-style hotel showcasing authentic architecture and cultural experiences.",
        image: "https://loremflickr.com/800/600/palace,heritage?random=44",
        location: "Paro",
        category: "Heritage",
        pricePerNight: "From $450",
        amenities: [
            "Traditional Architecture",
            "Hot Stone Bath",
            "Cultural Library",
            "Organic Garden",
            "Temple",
            "Traditional Dining"
        ],
        rating: 4
    },
    {
        id: "6",
        slug: "taj-tashi-thimphu",
        name: "Taj Tashi",
        description: "Elegant hotel in the heart of Thimphu combining modern luxury with Bhutanese traditions.",
        image: "https://loremflickr.com/800/600/hotel,city?random=45",
        location: "Thimphu",
        category: "Luxury",
        pricePerNight: "From $350",
        amenities: [
            "Jiva Spa",
            "Multiple Restaurants",
            "Business Center",
            "Fitness Center",
            "City Views",
            "Concierge Service"
        ],
        rating: 4
    },
    {
        id: "7",
        slug: "pemako-punakha",
        name: "Pemako Punakha",
        description: "Boutique hotel with stunning rice terrace views and intimate luxury accommodations.",
        image: "https://loremflickr.com/800/600/boutique,terrace?random=46",
        location: "Punakha",
        category: "Boutique",
        pricePerNight: "From $550",
        amenities: [
            "Rice Terrace Views",
            "Infinity Pool",
            "Spa",
            "Farm-to-Table Dining",
            "Private Villas",
            "Yoga Deck"
        ],
        rating: 5
    },
    {
        id: "8",
        slug: "aman-kora-thimphu",
        name: "Amankora Thimphu",
        description: "Serene retreat in a blue pine forest on the outskirts of Thimphu.",
        image: "https://loremflickr.com/800/600/forest,retreat?random=47",
        location: "Thimphu",
        category: "Luxury",
        pricePerNight: "From $1,100",
        amenities: [
            "Forest Setting",
            "Spa",
            "Fine Dining",
            "Library",
            "King-size Beds",
            "Heated Floors"
        ],
        rating: 5
    }
];

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
    return packages.find(pkg => pkg.slug === slug);
}

export async function getAllPackages(): Promise<Package[]> {
    return packages;
}

export async function getHotelsByLocation(location: string): Promise<Hotel[]> {
    return hotels.filter(hotel => hotel.location === location);
}

export async function getAllHotels(): Promise<Hotel[]> {
    return hotels;
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
    return hotels.find(hotel => hotel.slug === slug);
}
