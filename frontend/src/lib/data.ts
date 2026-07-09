export interface Destination {
    slug: string;
    name: string;
    description: string;
    image: string;
    region: string;
    highlights: string[];
    coordinates: [number, number]; // [lat, lng]
}



export interface Experience {
    _id?: string;
    slug: string;
    title: string;
    category: string;
    description: string;
    image: string;
    duration?: string;
    difficulty?: "Easy" | "Moderate" | "Challenging";
    coordinates?: [number, number]; // [latitude, longitude]
    destinationSlug?: string; // Link to a specific destination
    gallery?: string[];
}

export interface Hotel {
    _id?: string;
    id: string;
    name: string;
    description: string;
    image: string;
    destinationSlug: string;
    rating: number; // 1-5
    priceRange: "$$" | "$$$" | "$$$$";
}

export const destinations: Destination[] = [
    {
        slug: "thimphu",
        name: "Thimphu",
        description: "The capital city of Bhutan, known for its blend of modern development and ancient traditions. Visit the Tashichho Dzong, the seat of government, and the National Memorial Chorten.",
        image: "https://images.unsplash.com/photo-1578500263628-936ddec022cf?q=80&w=2940&auto=format&fit=crop",
        region: "Western Bhutan",
        highlights: ["Tashichho Dzong", "Buddha Dordenma", "Folk Heritage Museum"],
        coordinates: [27.4728, 89.6393],
    },
    {
        slug: "paro",
        name: "Paro",
        description: "A historic valley home to many of Bhutan's oldest temples and monasteries, including the iconic Tiger's Nest (Paro Taktsang).",
        image: "https://images.unsplash.com/photo-1620037169426-34d283626786?q=80&w=2938&auto=format&fit=crop",
        region: "Western Bhutan",
        highlights: ["Tiger's Nest", "Paro Dzong", "National Museum"],
        coordinates: [27.4286, 89.4162],
    },
    {
        slug: "punakha",
        name: "Punakha",
        description: "The former capital of Bhutan, famous for the majestic Punakha Dzong located at the confluence of the Pho Chhu and Mo Chhu rivers.",
        image: "https://images.unsplash.com/photo-1626014902802-bd9045b63486?q=80&w=2938&auto=format&fit=crop",
        region: "Central Bhutan",
        highlights: ["Punakha Dzong", "Chimi Lhakhang", "Suspension Bridge"],
        coordinates: [27.5921, 89.8797],
    },
    {
        slug: "bumthang",
        name: "Bumthang",
        description: "Considered the spiritual heartland of Bhutan, Bumthang consists of four valleys and is home to some of the country's most ancient temples.",
        image: "https://images.unsplash.com/photo-1549419163-4796333bf84c?q=80&w=2940&auto=format&fit=crop",
        region: "Central Bhutan",
        highlights: ["Jakar Dzong", "Kurjey Lhakhang", "Burning Lake"],
        coordinates: [27.5500, 90.7333],
    },
    {
        slug: "gangtey",
        name: "Gangtey",
        description: "A vast U-shaped glacial valley, also known as Phobjikha Valley, famous for being the winter home of the black-necked cranes.",
        image: "https://images.unsplash.com/photo-1594901967202-b0653d941865?q=80&w=2940&auto=format&fit=crop",
        region: "Central Bhutan",
        highlights: ["Gangtey Monastery", "Black-Necked Crane Center", "Nature Trails"],
        coordinates: [27.4526, 90.1917],
    },
];

export const experiences: Experience[] = [
    {
        slug: "wellness",
        title: "Wellness & Rejuvenation",
        category: "Relaxation",
        description: "Bhutan is a sanctuary for the soul. Immerse yourself in traditional healing practices, from hot stone baths to meditation retreats in serene monasteries. Our wellness journeys are designed to restore balance to your mind, body, and spirit.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2940&auto=format&fit=crop",
        coordinates: [27.4728, 89.6393], // Thimphu area
        destinationSlug: "thimphu",
        gallery: [
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600334129128-685c5426d605?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2931&auto=format&fit=crop"
        ]
    },
    {
        slug: "festivals",
        title: "Festivals & Culture",
        category: "Culture",
        description: "Experience the vibrant heartbeat of Bhutan through its Tshechus. Witness masked dances, receive blessings, and join locals in celebrating their rich heritage. These festivals are a riot of color and spiritual energy.",
        image: "https://images.unsplash.com/photo-1605649988358-3cc42c676451?q=80&w=2940&auto=format&fit=crop",
        coordinates: [27.5921, 90.4183], // Bumthang area
        destinationSlug: "bumthang",
        gallery: [
            "https://images.unsplash.com/photo-1580133318324-f2f76d44503b?q=80&w=2835&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1563297129-e33719b33a7e?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620037169426-34d283626786?q=80&w=2938&auto=format&fit=crop"
        ]
    },
    {
        slug: "nature",
        title: "Nature & Wildlife",
        category: "Nature",
        description: "As the world's only carbon-negative country, Bhutan offers untouched landscapes. Explore pristine forests, spot rare wildlife like the black-necked crane, and breathe the purest air in the Himalayas.",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2940&auto=format&fit=crop",
        coordinates: [27.4526, 90.1917], // Phobjikha Valley
        destinationSlug: "gangtey",
        gallery: [
            "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1472396961693-142e62a81e00?q=80&w=2894&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop"
        ]
    },
    {
        slug: "snowman-trek",
        title: "Snowman Trek",
        category: "Adventure",
        description: "One of the most difficult treks in the world, traversing the remote Lunana region and crossing numerous high passes.",
        image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2940&auto=format&fit=crop",
        duration: "25 Days",
        difficulty: "Challenging",
        coordinates: [28.0300, 89.9600], // High Himalayas
        destinationSlug: "destinations", // General
        gallery: [
            "https://images.unsplash.com/photo-1464278533981-50106e6176b1?q=80&w=2874&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1483728642387-9c3be665c3a6?q=80&w=2940&auto=format&fit=crop"
        ]
    },
    {
        slug: "tshechu-festival",
        title: "Tshechu Festival",
        category: "Culture",
        description: "Witness the colorful masked dances and spiritual celebrations at a local Tshechu, a highlight of Bhutanese culture.",
        image: "https://images.unsplash.com/photo-1605649988358-3cc42c676451?q=80&w=2940&auto=format&fit=crop",
        duration: "1 Day",
        difficulty: "Easy",
        coordinates: [27.4287, 89.4164], // Paro Dzong
        destinationSlug: "paro",
        gallery: [
            "https://images.unsplash.com/photo-1580133318324-f2f76d44503b?q=80&w=2835&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1563297129-e33719b33a7e?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620037169426-34d283626786?q=80&w=2938&auto=format&fit=crop"
        ]
    },
    {
        slug: "hot-stone-bath",
        title: "Traditional Hot Stone Bath",
        category: "Wellness",
        description: "Relax in a wooden tub filled with water heated by river stones roasted on a fire, believed to have medicinal properties.",
        image: "https://plus.unsplash.com/premium_photo-1661962386851-404fd8d4323e?q=80&w=2940&auto=format&fit=crop",
        duration: "2 Hours",
        difficulty: "Easy",
        coordinates: [27.5000, 89.6000], // Near Thimphu
        destinationSlug: "thimphu",
        gallery: [
            "https://images.unsplash.com/photo-1591813959929-c09534571c4c?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"
        ]
    },
    {
        slug: "tiger-nest-hike",
        title: "Hike to Tiger's Nest",
        category: "Adventure",
        description: "A pilgrimage to the most sacred site in Bhutan, perched on a cliff 900 meters above the Paro valley.",
        image: "https://images.unsplash.com/photo-1620037169426-34d283626786?q=80&w=2938&auto=format&fit=crop",
        duration: "5 Hours",
        difficulty: "Moderate",
        coordinates: [27.4919, 89.3635], // Tiger's Nest
        destinationSlug: "paro",
        gallery: [
            "https://images.unsplash.com/photo-1589139268846-5e5d1668e14d?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1428515613728-6b4607e44363?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2984&auto=format&fit=crop"
        ]
    },
    {
        slug: "punakha-dzong-visit",
        title: "Punakha Dzong Visit",
        category: "Culture",
        description: "Explore the stunning architecture of Punakha Dzong, the second oldest and second largest dzong in Bhutan.",
        image: "https://images.unsplash.com/photo-1626014902802-bd9045b63486?q=80&w=2938&auto=format&fit=crop",
        duration: "3 Hours",
        difficulty: "Easy",
        coordinates: [27.5921, 89.8797],
        destinationSlug: "punakha",
        gallery: [
            "https://images.unsplash.com/photo-1616599908611-66795f59c836?q=80&w=2938&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1528659567990-2dc65f3a0915?q=80&w=2944&auto=format&fit=crop",
        ]
    },
    {
        slug: "rafts-phochhu",
        title: "Rafting on Pho Chhu",
        category: "Adventure",
        description: "Exhilarating white water rafting past the Punakha Dzong.",
        image: "https://images.unsplash.com/photo-1520038410233-7141dd88284e?q=80&w=2874&auto=format&fit=crop",
        duration: "4 Hours",
        difficulty: "Moderate",
        coordinates: [27.6000, 89.9000],
        destinationSlug: "punakha",
        gallery: []
    }
];

export const hotels: Hotel[] = [
    {
        id: "1",
        name: "Six Senses Punakha",
        description: "Commonly referred to as the 'Flying Farmhouse,' this lodge overlooks the valley's rice paddies.",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop",
        destinationSlug: "punakha",
        rating: 5,
        priceRange: "$$$$"
    },
    {
        id: "2",
        name: "Amankora Punakha",
        description: "Set in an orange orchard near the Punakha Dzong, offering traditional luxury.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop",
        destinationSlug: "punakha",
        rating: 5,
        priceRange: "$$$$"
    },
    {
        id: "3",
        name: "COMO Uma Punakha",
        description: "An intimate luxury lodge located on a bend in the Mo Chu river.",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2940&auto=format&fit=crop",
        destinationSlug: "punakha",
        rating: 5,
        priceRange: "$$$$"
    },
    {
        id: "4",
        name: "Le Méridien Paro",
        description: "Riverfront hotel offering a perfect blend of culture and modern amenities.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop",
        destinationSlug: "paro",
        rating: 5,
        priceRange: "$$$"
    },
    {
        id: "5",
        name: "Amankora Thimphu",
        description: "Set in a blue pine forest up high in the Thimphu valley.",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2949&auto=format&fit=crop",
        destinationSlug: "thimphu",
        rating: 5,
        priceRange: "$$$$"
    }
];

export interface PressItem {
    name: string;
}

export const press: PressItem[] = [
    { name: "Condé Nast Traveler" },
    { name: "National Geographic" },
    { name: "Travel + Leisure" },
    { name: "Vogue" },
    { name: "The New York Times" },
];

export async function getAllDestinations(): Promise<Destination[]> {
    return destinations;
}

export async function getAllExperiences(): Promise<Experience[]> {
    return experiences;
}

export async function getAllHotels(): Promise<Hotel[]> {
    return hotels;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    return destinations.find(d => d.slug === slug);
}

export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
    return experiences.find(e => e.slug === slug);
}

export async function getHotelsByDestination(slug: string): Promise<Hotel[]> {
    return hotels.filter(h => h.destinationSlug === slug);
}

export async function getExperiencesByDestination(slug: string): Promise<Experience[]> {
    return experiences.filter(e => e.destinationSlug === slug);
}

export interface TripRequest {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    type: "Prepackaged" | "Custom";
    status: "Pending" | "Accepted" | "Rejected" | "Proposed";

    // Details
    destination?: string;
    packageSlug?: string;
    packageName?: string; // Helper for display
    startDate?: string;
    endDate?: string;
    numberOfTravelers: number;

    // Custom specific
    budget?: string;
    interests?: string[];

    // Metadata
    notes?: string;
    createdAt: string;

    // Admin side
    adminFeedback?: string;
    adminProposal?: string;
}

export const tripRequests: TripRequest[] = [
    {
        id: "TR-2024-001",
        userId: "user_123",
        userName: "John Doe",
        userEmail: "john@example.com",
        type: "Prepackaged",
        status: "Pending",
        packageSlug: "snowman-trek",
        packageName: "Snowman Trek",
        startDate: "2025-10-01",
        numberOfTravelers: 2,
        notes: "We are experienced hikers.",
        createdAt: "2024-12-10T10:00:00Z"
    },
    {
        id: "TR-2024-002",
        userId: "user_456",
        userName: "Alice Smith",
        userEmail: "alice@example.com",
        type: "Custom",
        status: "Pending",
        destination: "Bumthang & Paro",
        numberOfTravelers: 4,
        budget: "$5000 - $8000",
        interests: ["Culture", "Wellness"],
        startDate: "2025-04-15",
        endDate: "2025-04-25",
        notes: "Looking for a relaxing cultural tour with some hot stone baths.",
        createdAt: "2024-12-12T14:30:00Z"
    },
    {
        id: "TR-2024-003",
        userId: "user_789",
        userName: "Bob Wilson",
        userEmail: "bob@example.com",
        type: "Prepackaged",
        status: "Accepted",
        packageSlug: "tshechu-festival",
        packageName: "Tshechu Festival",
        startDate: "2025-03-20",
        numberOfTravelers: 1,
        createdAt: "2024-12-05T09:15:00Z"
    },
    {
        id: "TR-2024-004",
        userId: "user_101",
        userName: "Sarah Jenkins",
        userEmail: "sarah@example.com",
        type: "Custom",
        status: "Proposed",
        destination: "Thimphu",
        numberOfTravelers: 2,
        budget: "$3000",
        interests: ["Adventure"],
        startDate: "2025-06-01",
        notes: "We want to do rafting.",
        createdAt: "2024-12-01T11:20:00Z",
        adminProposal: "We suggest adding a day trip to Punakha for the best rafting experience."
    }
];
