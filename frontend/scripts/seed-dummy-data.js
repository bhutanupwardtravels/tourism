const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config({
  path: [path.join(__dirname, "../.env.local"), path.join(__dirname, "../.env")],
});

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing environment variables: "NEXT_PUBLIC_SUPABASE_URL" and/or "SUPABASE_SERVICE_ROLE_KEY"'
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Table columns are snake_case; the data literals below stay camelCase like
// the app. Only top-level keys are converted — jsonb payloads keep camelCase.
const toSnake = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toRow = (doc) =>
  Object.fromEntries(Object.entries(doc).map(([k, v]) => [toSnake(k), v]));

// Inserts docs and returns the created rows (in insert order) with Mongo-style
// `_id` aliases so the slug->doc reference maps below keep working.
async function insertMany(table, docs) {
  const { data, error } = await supabase
    .from(table)
    .insert(docs.map(toRow))
    .select("*");
  if (error) throw new Error(`Insert into ${table} failed: ${error.message}`);
  return data.map((row) => ({ ...row, _id: row.id }));
}

const image = {
  paro: "/images/cinematic/paro.jpg",
  thimphu: "/images/cinematic/thimphu.jpg",
  punakha: "/images/cinematic/punakha.jpg",
  bumthang: "/images/cinematic/bumthang.jpg",
  default: "/images/cinematic/thimphu.jpg",
};

async function seedDummyData() {
  try {
    console.log("Seeding logical dummy test data...");

    const tablesToReset = [
      "tour_requests",
      "tours",
      "hotels",
      "experiences",
      "experience_types",
      "destinations",
      "global_costs",
    ];

    for (const name of tablesToReset) {
      const { error } = await supabase.from(name).delete().not("id", "is", null);
      if (error) throw new Error(`Reset of ${name} failed: ${error.message}`);
    }

    const now = new Date().toISOString();

    const destinations = [
      {
        slug: "paro",
        name: "Paro",
        description:
          "Gateway valley with Bhutan's international airport and key monasteries.",
        image: image.paro,
        region: "Western Bhutan",
        coordinates: [27.4286, 89.4167],
        priority: 4,
        isEntryPoint: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "thimphu",
        name: "Thimphu",
        description:
          "Bhutan's capital city known for cultural landmarks and modern Bhutanese life.",
        image: image.thimphu,
        region: "Western Bhutan",
        coordinates: [27.4728, 89.639],
        priority: 3,
        isEntryPoint: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "punakha",
        name: "Punakha",
        description:
          "Warm valley destination with riverside dzongs and scenic countryside trails.",
        image: image.punakha,
        region: "Western Bhutan",
        coordinates: [27.5912, 89.877],
        priority: 2,
        isEntryPoint: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "bumthang",
        name: "Bumthang",
        description:
          "Spiritual heartland in central Bhutan with temple clusters and pine valleys.",
        image: image.bumthang,
        region: "Central Bhutan",
        coordinates: [27.5495, 90.752],
        priority: 1,
        isEntryPoint: false,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const destinationDocs = await insertMany("destinations", destinations);

    const destinationBySlug = Object.fromEntries(
      destinationDocs.map((d) => [d.slug, d])
    );

    const experienceTypes = [
      {
        slug: "cultural",
        title: "Cultural Tours",
        description: "Monasteries, dzongs, and living Bhutanese traditions.",
        image: image.default,
        displayOrder: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "hiking",
        title: "Hiking & Nature",
        description: "Valley hikes, forest trails, and mountain viewpoints.",
        image: image.default,
        displayOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "wellness",
        title: "Wellness",
        description: "Traditional hot stone baths and restorative experiences.",
        image: image.default,
        displayOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const experienceTypeDocs = await insertMany("experience_types", experienceTypes);

    const typeBySlug = Object.fromEntries(experienceTypeDocs.map((t) => [t.slug, t]));

    const costs = [
      {
        title: "SDF - Adult (International)",
        description: "Sustainable Development Fee per adult per night.",
        price: 100,
        type: "daily",
        isIndianNational: false,
        travelerCategory: "adult",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "SDF - Child (6-12)",
        description: "Reduced daily fee for children aged 6 to 12.",
        price: 50,
        type: "daily",
        isIndianNational: false,
        travelerCategory: "child_6_12",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Guide Fee",
        description: "Licensed guide fee applied per day per group.",
        price: 45,
        type: "daily",
        isIndianNational: false,
        travelerCategory: "adult",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Visa Processing",
        description: "One-time Bhutan visa processing service fee.",
        price: 40,
        type: "fixed",
        isIndianNational: false,
        travelerCategory: "adult",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const costDocs = await insertMany("global_costs", costs);
    const costIds = costDocs.map((c) => c.id);

    const experiences = [
      {
        slug: "tigers-nest-hike",
        title: "Tiger's Nest Monastery Hike",
        category: typeBySlug.hiking._id.toString(),
        description:
          "A half-day to full-day guided hike to Bhutan's iconic cliffside monastery.",
        image: image.paro,
        duration: "5-6 hours",
        difficulty: "Moderate",
        destinations: [destinationBySlug.paro._id.toString()],
        destinationSlug: "paro",
        coordinates: [27.4923, 89.3637],
        gallery: [image.paro, image.thimphu],
        priority: 5,
        price: 90,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "punakha-dzong-visit",
        title: "Punakha Dzong and Riverside Walk",
        category: typeBySlug.cultural._id.toString(),
        description:
          "Explore the historic dzong and enjoy a relaxed walk by the riverside.",
        image: image.punakha,
        duration: "2 hours",
        difficulty: "Easy",
        destinations: [destinationBySlug.punakha._id.toString()],
        destinationSlug: "punakha",
        coordinates: [27.6121, 89.8666],
        gallery: [image.punakha],
        priority: 4,
        price: 35,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "thimphu-cultural-loop",
        title: "Thimphu Cultural Loop",
        category: typeBySlug.cultural._id.toString(),
        description:
          "A city day covering Memorial Chorten, Buddha Dordenma, and local craft spots.",
        image: image.thimphu,
        duration: "4 hours",
        difficulty: "Easy",
        destinations: [destinationBySlug.thimphu._id.toString()],
        destinationSlug: "thimphu",
        coordinates: [27.4946, 89.6393],
        gallery: [image.thimphu],
        priority: 3,
        price: 40,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "bumthang-temple-trail",
        title: "Bumthang Temple Trail",
        category: typeBySlug.cultural._id.toString(),
        description:
          "Visit key sacred temples and villages in Bhutan's spiritual heartland.",
        image: image.bumthang,
        duration: "5 hours",
        difficulty: "Easy",
        destinations: [destinationBySlug.bumthang._id.toString()],
        destinationSlug: "bumthang",
        coordinates: [27.5603, 90.7442],
        gallery: [image.bumthang],
        priority: 2,
        price: 55,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "traditional-hot-stone-bath",
        title: "Traditional Hot Stone Bath",
        category: typeBySlug.wellness._id.toString(),
        description:
          "A restorative Bhutanese evening wellness ritual after active travel days.",
        image: image.thimphu,
        duration: "90 minutes",
        difficulty: "Easy",
        destinations: [destinationBySlug.thimphu._id.toString(), destinationBySlug.punakha._id.toString()],
        destinationSlug: "thimphu",
        coordinates: [27.4728, 89.639],
        gallery: [image.thimphu, image.punakha],
        priority: 1,
        price: 60,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const experienceDocs = await insertMany("experiences", experiences);

    const experienceBySlug = Object.fromEntries(
      experienceDocs.map((exp) => [exp.slug, exp])
    );

    const hotels = [
      {
        name: "Paro Valley Lodge",
        slug: "paro-valley-lodge",
        location: "Paro Town",
        description: "Comfortable 4-star stay near Paro attractions and airport.",
        image: image.paro,
        destination: destinationBySlug.paro._id.toString(),
        destinationId: destinationBySlug.paro._id.toString(),
        destinationSlug: "paro",
        rating: 4.2,
        amenities: ["WiFi", "Restaurant", "Heating"],
        priceRange: "Upper Mid",
        rooms: 30,
        coordinates: [27.4301, 89.4131],
        gallery: [image.paro],
        priority: 4,
        price: 180,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Thimphu Heritage Hotel",
        slug: "thimphu-heritage-hotel",
        location: "Central Thimphu",
        description: "City hotel suitable for cultural tours and business stops.",
        image: image.thimphu,
        destination: destinationBySlug.thimphu._id.toString(),
        destinationId: destinationBySlug.thimphu._id.toString(),
        destinationSlug: "thimphu",
        rating: 4.4,
        amenities: ["WiFi", "Spa", "Breakfast"],
        priceRange: "Luxury",
        rooms: 42,
        coordinates: [27.4734, 89.6397],
        gallery: [image.thimphu],
        priority: 3,
        price: 240,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Punakha Riverside Retreat",
        slug: "punakha-riverside-retreat",
        location: "Punakha Valley",
        description: "Scenic stay close to Punakha Dzong and valley hiking routes.",
        image: image.punakha,
        destination: destinationBySlug.punakha._id.toString(),
        destinationId: destinationBySlug.punakha._id.toString(),
        destinationSlug: "punakha",
        rating: 4.3,
        amenities: ["River View", "WiFi", "Restaurant"],
        priceRange: "Upper Mid",
        rooms: 26,
        coordinates: [27.6133, 89.8651],
        gallery: [image.punakha],
        priority: 2,
        price: 210,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Bumthang Orchard Residency",
        slug: "bumthang-orchard-residency",
        location: "Jakar, Bumthang",
        description: "Quiet mountain accommodation ideal for central Bhutan exploration.",
        image: image.bumthang,
        destination: destinationBySlug.bumthang._id.toString(),
        destinationId: destinationBySlug.bumthang._id.toString(),
        destinationSlug: "bumthang",
        rating: 4.1,
        amenities: ["WiFi", "Local Cuisine", "Parking"],
        priceRange: "Mid",
        rooms: 20,
        coordinates: [27.5492, 90.747],
        gallery: [image.bumthang],
        priority: 1,
        price: 160,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const hotelDocs = await insertMany("hotels", hotels);

    const hotelBySlug = Object.fromEntries(hotelDocs.map((h) => [h.slug, h]));

    const tours = [
      {
        slug: "classic-western-bhutan-7d",
        title: "Classic Western Bhutan 7D/6N",
        description:
          "Balanced first-time route through Paro, Thimphu, and Punakha with cultural highlights.",
        image: image.paro,
        duration: "7 Days / 6 Nights",
        price: 2450,
        priority: 3,
        category: "Culture & Scenic",
        highlights: [
          "Tiger's Nest Hike",
          "Thimphu Cultural Landmarks",
          "Punakha Dzong Visit",
          "Traditional Hot Stone Bath",
        ],
        selectedCostIds: costIds,
        days: [
          {
            day: 1,
            title: "Arrive Paro and transfer to Thimphu",
            description: "Airport pick-up in Paro, scenic transfer, and evening rest in Thimphu.",
            image: image.thimphu,
            hotelId: hotelBySlug["thimphu-heritage-hotel"]._id.toString(),
            items: [
              {
                type: "travel",
                order: 0,
                destinationFromId: destinationBySlug.paro._id.toString(),
                destinationToId: destinationBySlug.thimphu._id.toString(),
                travel: {
                  from: destinationBySlug.paro._id.toString(),
                  to: destinationBySlug.thimphu._id.toString(),
                  duration: 90,
                },
              },
            ],
          },
          {
            day: 2,
            title: "Thimphu cultural loop",
            description: "Guided city sightseeing and cultural immersion.",
            image: image.thimphu,
            hotelId: hotelBySlug["thimphu-heritage-hotel"]._id.toString(),
            items: [
              {
                type: "experience",
                order: 0,
                experienceId: experienceBySlug["thimphu-cultural-loop"]._id.toString(),
                hotelId: hotelBySlug["thimphu-heritage-hotel"]._id.toString(),
              },
            ],
          },
          {
            day: 3,
            title: "Drive to Punakha",
            description: "Mountain pass drive and check-in at riverside retreat.",
            image: image.punakha,
            hotelId: hotelBySlug["punakha-riverside-retreat"]._id.toString(),
            items: [
              {
                type: "travel",
                order: 0,
                destinationFromId: destinationBySlug.thimphu._id.toString(),
                destinationToId: destinationBySlug.punakha._id.toString(),
                travel: {
                  from: destinationBySlug.thimphu._id.toString(),
                  to: destinationBySlug.punakha._id.toString(),
                  duration: 180,
                },
              },
            ],
          },
          {
            day: 4,
            title: "Punakha valley exploration",
            description: "Visit Punakha Dzong and riverside trails.",
            image: image.punakha,
            hotelId: hotelBySlug["punakha-riverside-retreat"]._id.toString(),
            items: [
              {
                type: "experience",
                order: 0,
                experienceId: experienceBySlug["punakha-dzong-visit"]._id.toString(),
                hotelId: hotelBySlug["punakha-riverside-retreat"]._id.toString(),
              },
            ],
          },
          {
            day: 5,
            title: "Return to Paro",
            description: "Drive back to Paro with optional local market stop.",
            image: image.paro,
            hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
            items: [
              {
                type: "travel",
                order: 0,
                destinationFromId: destinationBySlug.punakha._id.toString(),
                destinationToId: destinationBySlug.paro._id.toString(),
                travel: {
                  from: destinationBySlug.punakha._id.toString(),
                  to: destinationBySlug.paro._id.toString(),
                  duration: 240,
                },
              },
            ],
          },
          {
            day: 6,
            title: "Tiger's Nest day hike",
            description: "Guided day hike with time for viewpoints and monastery visit.",
            image: image.paro,
            hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
            items: [
              {
                type: "experience",
                order: 0,
                experienceId: experienceBySlug["tigers-nest-hike"]._id.toString(),
                hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
              },
            ],
          },
          {
            day: 7,
            title: "Departure",
            description: "Airport transfer and onward departure.",
            image: image.paro,
            hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
            items: [],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "paro-thimphu-short-break-4d",
        title: "Paro and Thimphu Short Break 4D/3N",
        description:
          "Short and practical Bhutan trip for travelers with limited time.",
        image: image.thimphu,
        duration: "4 Days / 3 Nights",
        price: 1290,
        priority: 2,
        category: "Short Escape",
        highlights: ["Paro Heritage", "Tiger's Nest", "Thimphu Culture"],
        selectedCostIds: costIds.slice(0, 3),
        days: [
          {
            day: 1,
            title: "Arrive Paro",
            description: "Arrival and transfer to hotel.",
            image: image.paro,
            hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
            items: [],
          },
          {
            day: 2,
            title: "Paro highlights",
            description: "Tiger's Nest hike for active travelers.",
            image: image.paro,
            hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
            items: [
              {
                type: "experience",
                order: 0,
                experienceId: experienceBySlug["tigers-nest-hike"]._id.toString(),
              },
            ],
          },
          {
            day: 3,
            title: "Transfer to Thimphu",
            description: "Cultural city tour on arrival.",
            image: image.thimphu,
            hotelId: hotelBySlug["thimphu-heritage-hotel"]._id.toString(),
            items: [
              {
                type: "travel",
                order: 0,
                travel: {
                  from: destinationBySlug.paro._id.toString(),
                  to: destinationBySlug.thimphu._id.toString(),
                  duration: 90,
                },
              },
              {
                type: "experience",
                order: 1,
                experienceId: experienceBySlug["thimphu-cultural-loop"]._id.toString(),
              },
            ],
          },
          {
            day: 4,
            title: "Departure",
            description: "Drive to Paro airport and depart.",
            image: image.paro,
            hotelId: hotelBySlug["paro-valley-lodge"]._id.toString(),
            items: [
              {
                type: "travel",
                order: 0,
                travel: {
                  from: destinationBySlug.thimphu._id.toString(),
                  to: destinationBySlug.paro._id.toString(),
                  duration: 90,
                },
              },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const tourDocs = await insertMany("tours", tours);
    const requests = [
      {
        firstName: "Ava",
        lastName: "Sharma",
        email: "ava.sharma@example.com",
        phone: "+91-9876543210",
        destination: "Paro",
        travelDate: "2026-10-12",
        travelers: "2",
        message:
          "Looking for a first Bhutan trip with moderate hiking and cultural highlights.",
        tourId: tourDocs[0]._id.toString(),
        tourName: tourDocs[0].title,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Noah",
        lastName: "Kim",
        email: "noah.kim@example.com",
        phone: "+1-415-555-0136",
        destination: "Punakha",
        travelDate: "2026-11-03",
        travelers: "4",
        message:
          "Family trip request with easy activities for mixed age group.",
        tourId: tourDocs[0]._id.toString(),
        tourName: tourDocs[0].title,
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Mia",
        lastName: "Lopez",
        email: "mia.lopez@example.com",
        phone: "+34-600-123-123",
        destination: "Thimphu",
        travelDate: "2026-12-20",
        travelers: "1",
        message: "I need a short 4-day trip with private room and city exploration.",
        tourId: tourDocs[1]._id.toString(),
        tourName: tourDocs[1].title,
        status: "rejected",
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Liam",
        lastName: "Nguyen",
        email: "liam.nguyen@example.com",
        phone: "+61-410-221-889",
        destination: "Bumthang",
        travelDate: "2027-01-15",
        travelers: "3",
        message:
          "Interested in spiritual sites and lighter walking routes in central Bhutan.",
        tourId: "",
        tourName: "",
        status: "archived",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await insertMany("tour_requests", requests);

    console.log("Dummy data seeded successfully.");
    console.log("Collections seeded:");
    console.log("- destinations:", destinations.length);
    console.log("- experience_types:", experienceTypes.length);
    console.log("- global_costs:", costs.length);
    console.log("- experiences:", experiences.length);
    console.log("- hotels:", hotels.length);
    console.log("- tours:", tours.length);
    console.log("- tour_requests:", requests.length);
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    process.exitCode = 1;
  }
}

seedDummyData();
