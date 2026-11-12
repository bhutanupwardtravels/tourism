// Long-form guide pages served at /bhutan-travel-guide/[slug]. Static content so
// the pages are fully crawlable server-rendered HTML. Facts mirror
// bhutan-faq.ts; festival dates follow the Bhutanese lunar calendar and move
// every year, so only the usual season is stated, never a fixed date.

export interface GuideSection {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
}

export interface Guide {
    slug: string;
    /** <title> before the site-name suffix. */
    title: string;
    /** Visible H1. */
    heading: string;
    description: string;
    intro: string;
    sections: GuideSection[];
    faqs: { question: string; answer: string }[];
    /** Optional featured link shown under the intro, for guides that point readers at an existing catalog page rather than their own listing. */
    primaryLink?: { label: string; href: string };
}

export const guides: Guide[] = [
    {
        slug: "best-time-to-visit-bhutan",
        title: "Best Time to Visit Bhutan — Month-by-Month Guide",
        heading: "Best Time to Visit Bhutan",
        description:
            "When to visit Bhutan: spring and autumn for clear skies and festivals, winter for quiet trails, summer for green valleys. Month-by-month guidance from a licensed Bhutan travel agency.",
        intro:
            "Bhutan can be visited all year, but the experience changes sharply with the season. Spring and autumn are the most popular windows; winter and summer reward travellers who prefer quiet or greenery. Here is how each season compares, so you can match your trip to what you want to see.",
        sections: [
            {
                heading: "Spring (March to May)",
                paragraphs: [
                    "Spring is one of the two peak seasons. Rhododendrons bloom across the higher passes, valleys turn green, and the Paro Tshechu draws visitors to the west of the country. Days are mild in Paro, Thimphu and Punakha, and mountain views are often clear in the mornings.",
                    "Book early: flights into Paro and the better hotels fill months ahead around festival dates.",
                ],
            },
            {
                heading: "Summer monsoon (June to August)",
                paragraphs: [
                    "Rain falls mostly in the afternoons and evenings, and clouds hide the high peaks, but the landscape is at its greenest and there are far fewer visitors. It suits travellers who care more about culture, hotels and quiet monasteries than about mountain panoramas.",
                    "Treks at higher altitude are harder in the wet months; shorter cultural itineraries work best.",
                ],
            },
            {
                heading: "Autumn (September to November)",
                paragraphs: [
                    "Autumn is the other peak season, with settled weather, crisp air and the clearest Himalayan views of the year. It is also festival season, including the Thimphu Tshechu, and the black-necked cranes return to the Phobjikha valley in November.",
                    "This is the best window for trekking and for first-time visitors who want the widest choice of itineraries.",
                ],
            },
            {
                heading: "Winter (December to February)",
                paragraphs: [
                    "Winter brings cold nights but often bright, dry days with sharp mountain views. Crowds are at their lowest and rates are lower. Lower valleys such as Punakha stay comfortable, while the high passes can be snowbound.",
                ],
            },
            {
                heading: "How to choose",
                paragraphs: ["Match the season to your priority:"],
                bullets: [
                    "Festivals and flowers: March to May, or October to November.",
                    "Clear mountain views and trekking: late September to November.",
                    "Fewer visitors and lower prices: December to February, or June to August.",
                ],
            },
        ],
        faqs: [
            {
                question: "What is the best month to visit Bhutan?",
                answer:
                    "April and October are widely considered the best months: settled weather, clear views and major festivals. If you want fewer crowds, March, May, November and the winter months are good alternatives.",
            },
            {
                question: "Is Bhutan worth visiting in the monsoon?",
                answer:
                    "Yes, if you prefer green landscapes and quiet sites over mountain views. Expect afternoon rain, and plan cultural itineraries rather than high-altitude treks.",
            },
        ],
    },
    {
        slug: "bhutan-visa-guide",
        title: "Bhutan Visa Guide — How to Get a Bhutan Tourist Visa",
        heading: "Bhutan Visa Guide",
        description:
            "Bhutan visa requirements explained: who needs a visa, how a licensed tour operator applies for it, the Sustainable Development Fee, and what to prepare before you travel.",
        intro:
            "This guide covers Bhutan visa requirements in full. Most visitors cannot apply for a Bhutan tourist visa on their own — it is processed through a licensed Bhutanese tour operator as part of your booking. Here is what you need to prepare.",
        sections: [
            {
                heading: "Who needs a visa",
                paragraphs: [
                    "All foreign tourists need a visa, except citizens of India, Bangladesh and the Maldives, who enter under different arrangements. Indian nationals travel with a permit and an ID document rather than a visa, and may still need extra permits for certain regions.",
                ],
            },
            {
                heading: "How the application works",
                paragraphs: [
                    "Your licensed operator submits the application on your behalf once your tour is confirmed. The usual steps are:",
                ],
                bullets: [
                    "Confirm your itinerary and dates with the operator.",
                    "Send a clear scan of your passport (valid at least six months beyond your travel dates) and your contact details.",
                    "Pay the tour package, which includes the Sustainable Development Fee and visa fee, by bank transfer.",
                    "The operator obtains visa approval, and you receive a visa confirmation to show on check-in for your flight.",
                ],
            },
            {
                heading: "The Sustainable Development Fee",
                paragraphs: [
                    "Every international visitor pays the Sustainable Development Fee (SDF) per person per night. It funds free healthcare, education and conservation, and it is included in Bhutan Upward Travels packages. The current rate is US$100 per night, valid through 31 August 2027. Because rates and rules change, confirm the latest figures with us before you book.",
                ],
            },
            {
                heading: "How long it takes",
                paragraphs: [
                    "Allow at least two to three weeks before departure, and longer in festival season. Your flights and hotels should be reserved at the same time, since Paro has limited seats.",
                ],
            },
        ],
        faqs: [
            {
                question: "Can I apply for a Bhutan visa myself?",
                answer:
                    "Generally no. Tourist visas are arranged through a licensed Bhutanese tour operator, which submits your documents and pays the visa fee as part of your package.",
            },
            {
                question: "How long does a Bhutan visa take?",
                answer:
                    "Plan for two to three weeks before departure. Apply earlier for spring and autumn festival dates.",
            },
        ],
    },
    {
        slug: "bhutan-festival-guide",
        title: "Bhutan Festivals Guide — Tshechus and When to Go",
        heading: "Bhutan Festivals Guide",
        description:
            "A guide to Bhutan's main festivals: Paro Tshechu, Thimphu Tshechu, Jambay Lhakhang Drup, Gangtey and more. When they usually happen and how to plan a festival trip.",
        intro:
            "Bhutan's festivals, called tshechus, are masked dances held in monastery courtyards in honour of Guru Rinpoche. Locals dress in their finest, and visitors are welcome to watch. Dates follow the Bhutanese lunar calendar, so they shift every year; confirm exact days when you plan.",
        sections: [
            {
                heading: "Major festivals and their usual season",
                paragraphs: ["These are among the most visited festivals:"],
                bullets: [
                    "Paro Tshechu: usually March or April, famous for the unfurling of a giant thongdrel (sacred scroll) at dawn on the last day.",
                    "Thimphu Tshechu: usually September or October, held in the capital's Tashichho Dzong.",
                    "Jambay Lhakhang Drup: usually October or November in Bumthang, known for its fire ceremony.",
                    "Gangtey Tshechu and Black-Necked Crane Festival: usually autumn, in the Phobjikha valley.",
                    "Punakha Tshechu and Drubchen: usually February or March, at the Punakha Dzong.",
                ],
            },
            {
                heading: "Planning a festival trip",
                paragraphs: [
                    "Festival dates are the busiest of the year. Book flights and hotels at least six months ahead, and ask your operator to build the itinerary so you reach the festival ground early; the best seats go quickly.",
                    "Dress modestly, with shoulders and knees covered, and follow your guide's advice on photography during the sacred dances.",
                ],
            },
        ],
        faqs: [
            {
                question: "What is a tshechu?",
                answer:
                    "A tshechu is an annual religious festival with masked dances held in a dzong or monastery. Each valley holds its own, on dates set by the lunar calendar.",
            },
            {
                question: "How far ahead should I book a festival tour?",
                answer:
                    "Book at least six months ahead. Flights and hotels around major festival dates sell out first.",
            },
        ],
    },
    {
        slug: "bhutan-tour-cost",
        title: "How Much Does a Bhutan Tour Cost? Price Guide",
        heading: "Bhutan Tour Cost Guide",
        description:
            "Bhutan travel cost explained: the US$100 per night Sustainable Development Fee, what a package includes, typical prices for 5, 7 and 10 days, and how to budget.",
        intro:
            "Bhutan travel cost is almost entirely bundled into one package price, since Bhutan is a high-value, low-volume destination. Most of what you pay is set upfront, so there are few surprises once you book.",
        sections: [
            {
                heading: "What a package includes",
                paragraphs: ["A standard Bhutan Upward Travels package covers:"],
                bullets: [
                    "The Sustainable Development Fee of US$100 per person per night.",
                    "Your licensed guide and a private vehicle with driver.",
                    "Accommodation, three meals a day and monument entrance fees.",
                    "Visa processing and airport transfers.",
                ],
            },
            {
                heading: "Typical prices",
                paragraphs: [
                    "Packages range from about US$250 to US$2,000 per person per night depending on hotel category and service. A standard five-day guided tour commonly runs around US$1,500 to US$1,700 per person. Groups, longer stays and off-season dates can lower the nightly rate.",
                ],
            },
            {
                heading: "What is not included",
                paragraphs: [
                    "International flights, flights into Paro, travel insurance, tips and personal purchases are usually extra. Ask for a written list of inclusions before you confirm.",
                ],
            },
            {
                heading: "Get a quote for your dates",
                paragraphs: [
                    "Use our trip planner to build an itinerary and receive a tailored quote, or send an enquiry and a Bhutanese specialist will reply with options.",
                ],
            },
        ],
        faqs: [
            {
                question: "Why is Bhutan expensive?",
                answer:
                    "Bhutan limits tourist numbers to protect its culture and environment. The nightly Sustainable Development Fee funds free healthcare and education, and the package bundles a guide, vehicle, hotels and meals.",
            },
            {
                question: "Can I visit Bhutan on a budget?",
                answer:
                    "The SDF sets a floor on cost, but you can lower the price with mid-range hotels, shorter stays, small groups and off-season travel.",
            },
        ],
    },
    {
        slug: "bhutan-tour-packages-from-india",
        title: "Bhutan Tour Packages from India — Permits, Flights & Itineraries",
        heading: "Bhutan Tour Packages from India",
        description:
            "Bhutan tour packages for Indian travellers: entry by road or air, permits, ID requirements and the daily Sustainable Development Fee. Plan with a licensed Bhutanese operator.",
        intro:
            "Indian nationals enjoy the easiest access to Bhutan: no visa, a simple entry permit, and the option to arrive by road or by air. Rules and fees differ from those for other nationalities, so here is what to expect.",
        sections: [
            {
                heading: "Getting there",
                paragraphs: [
                    "You can fly to Paro from several Indian cities, including Delhi, Kolkata, Bagdogra and Guwahati. Many travellers instead drive to Phuntsholing on the border, which makes a good overland start for the western circuit.",
                ],
            },
            {
                heading: "Permits and documents",
                paragraphs: [
                    "Indian citizens do not need a visa. Carry a valid passport or voter ID card. An entry permit is issued at the border or on arrival, and some regions need an additional route permit, which your operator can arrange.",
                ],
            },
            {
                heading: "Fees",
                paragraphs: [
                    "Indian visitors pay a lower Sustainable Development Fee than other nationalities. The rate changes, so confirm the current amount with us when you enquire.",
                ],
            },
            {
                heading: "Popular itineraries",
                paragraphs: ["Common choices from India include:"],
                bullets: [
                    "Paro and Thimphu in four to five days.",
                    "The western circuit with Punakha, six to seven days.",
                    "Central Bhutan and Bumthang, ten days or more.",
                ],
            },
        ],
        faqs: [
            {
                question: "Do Indians need a visa for Bhutan?",
                answer:
                    "No. Indian citizens enter with a valid passport or voter ID and an entry permit, and some regions need an extra permit.",
            },
            {
                question: "Can I drive to Bhutan from India?",
                answer:
                    "Yes. Many travellers enter by road at Phuntsholing. Your operator arranges the permit and a local vehicle.",
            },
        ],
    },
    {
        slug: "bhutan-tour-packages-from-usa-uk-europe",
        title: "Bhutan Tour Packages from the USA, UK, Europe and Australia",
        heading: "Bhutan Tours for International Travellers",
        description:
            "Plan a Bhutan trip from the USA, UK, Europe or Australia: flights via Delhi, Kolkata, Bangkok or Kathmandu, visa handling, the daily fee and sample itineraries.",
        intro:
            "Travellers from the USA, UK, Europe and Australia reach Bhutan by connecting through a regional hub. Everything else, including your visa, guide and transport, is arranged by your licensed Bhutan operator in one package.",
        sections: [
            {
                heading: "How to fly to Bhutan",
                paragraphs: [
                    "Only two airlines serve Paro International Airport, with connections from Delhi, Kolkata, Bagdogra, Guwahati, Kathmandu, Bangkok, Singapore and Dhaka, among others. Long-haul travellers usually fly first to one of these hubs and connect onward. Seats are limited, so reserve flights as soon as your dates are set.",
                ],
            },
            {
                heading: "Visa and fees",
                paragraphs: [
                    "Your operator processes the tourist visa, and the Sustainable Development Fee of US$100 per person per night is included in our packages. Payment is usually made in US dollars by bank transfer.",
                ],
            },
            {
                heading: "How long to stay",
                paragraphs: [
                    "Because of the journey, most international travellers choose seven to ten days. Five days covers Paro, Thimphu and the Tiger's Nest hike, while a longer trip adds Punakha, Phobjikha or Bumthang.",
                ],
            },
            {
                heading: "Plan with a local specialist",
                paragraphs: [
                    "Tell us your dates and interests and we will propose an itinerary. You can also build one yourself in our trip planner and request a quote.",
                ],
            },
        ],
        faqs: [
            {
                question: "How do I get to Bhutan from the USA or UK?",
                answer:
                    "Fly to a regional hub such as Delhi, Bangkok, Kathmandu or Singapore, then connect to Paro on Bhutan's national carriers. Your operator can advise on routings.",
            },
            {
                question: "How many days do international visitors need?",
                answer:
                    "Seven to ten days works best after a long journey, though a five-day trip can cover the main highlights.",
            },
        ],
    },
    {
        slug: "choosing-a-bhutan-travel-agency",
        title: "How to Choose a Bhutan Travel Agency or Tour Operator",
        heading: "Choosing a Bhutan Travel Agency",
        description:
            "How to choose a licensed Bhutan travel agency: verify the licence, compare inclusions, check reviews and avoid overseas resellers. A checklist from a Bhutanese tour operator.",
        intro:
            "Every foreign visitor must book through a licensed Bhutanese tour operator, so the choice of agency matters. This checklist helps you compare Bhutan travel companies on what counts.",
        sections: [
            {
                heading: "Verify the licence",
                paragraphs: [
                    "Ask for the operator's tourism licence number and check it against the Tourism Council of Bhutan's list of licensed operators. Many websites are resellers who pass your booking to a Bhutanese company, adding a margin.",
                ],
            },
            {
                heading: "Book direct with a local company",
                paragraphs: [
                    "A Bhutan-based operator controls your guide, vehicle and hotels directly, can adjust your itinerary on the ground, and does not add an intermediary's commission.",
                ],
            },
            {
                heading: "Compare what is included",
                paragraphs: ["Ask each company for a written list covering:"],
                bullets: [
                    "The Sustainable Development Fee, visa fee and monument fees.",
                    "Hotel names or categories, meals and vehicle type.",
                    "Guide experience and languages spoken.",
                    "Cancellation and refund terms.",
                ],
            },
            {
                heading: "Check reviews and responsiveness",
                paragraphs: [
                    "Read independent reviews and notice how quickly and clearly the company replies. A prompt, detailed answer before you book is a good sign of the service you will receive in Bhutan.",
                ],
            },
        ],
        faqs: [
            {
                question: "How do I know a Bhutan travel agency is licensed?",
                answer:
                    "Ask for the licence number and check it with the Tourism Council of Bhutan. A genuine operator will share it readily.",
            },
            {
                question: "Is it cheaper to book with a local Bhutan operator?",
                answer:
                    "Usually yes. Booking direct avoids a reseller's margin, and the minimum daily fee is the same regardless of who you book with.",
            },
        ],
    },
    {
        slug: "bhutan-trekking-tours",
        title: "Bhutan Trekking Tours — Routes, Difficulty & Best Season",
        heading: "Bhutan Trekking Tours",
        description:
            "Bhutan trekking tours and trails, from the half-day Tiger's Nest hike to multi-day routes like the Druk Path and Jomolhari. Difficulty, fitness level and the best season to go.",
        intro:
            "Bhutan's trekking routes range from a half-day climb to a cliffside monastery to multi-day treks through alpine passes that see very few outside visitors. Trekking group numbers are limited by law on every route, which keeps the trails quiet even in high season.",
        sections: [
            {
                heading: "Popular routes and difficulty",
                paragraphs: ["Trekking in Bhutan spans a wide range of effort and length:"],
                bullets: [
                    "Tiger's Nest (Taktsang) hike — half a day, moderate, included in almost every itinerary.",
                    "Druk Path Trek — about 5 days, moderate, alpine lakes between Paro and Thimphu.",
                    "Jomolhari Trek — 7 to 9 days, challenging, views of Mount Jomolhari near the Tibetan border.",
                    "Snowman Trek — 25 or more days, Bhutan's hardest trek, for experienced high-altitude trekkers only.",
                ],
            },
            {
                heading: "When to trek",
                paragraphs: [
                    "Spring (March to May) and autumn (September to November) give the clearest mountain views and the most stable trails. Most high routes are best avoided during the summer monsoon, June to August.",
                ],
            },
        ],
        primaryLink: {
            label: "Browse Bhutan trekking & nature experiences",
            href: "/experiences?category=Nature+Exploration",
        },
        faqs: [
            {
                question: "Do I need previous trekking experience for Bhutan?",
                answer:
                    "Not for shorter routes like the Druk Path, which suit a reasonably fit traveller. Longer, higher routes such as Jomolhari or the Snowman Trek need prior high-altitude experience.",
            },
            {
                question: "Is a guide required for trekking in Bhutan?",
                answer:
                    "Yes. All trekking in Bhutan is done with a licensed guide and crew arranged through your tour operator; independent trekking is not permitted.",
            },
        ],
    },
    {
        slug: "bhutan-honeymoon-packages",
        title: "Bhutan Honeymoon Packages — Private Itineraries for Couples",
        heading: "Bhutan Honeymoon Packages",
        description:
            "Bhutan honeymoon packages: private guided itineraries, boutique and luxury stays, and the best regions and pace for couples. What makes Bhutan different and how to plan.",
        intro:
            "Every Bhutan tour already travels as a private group with its own guide and vehicle, which makes the country naturally suited to a honeymoon: there is no fixed group to join and no shared itinerary to follow.",
        sections: [
            {
                heading: "What makes a Bhutan honeymoon different",
                paragraphs: [
                    "Because tours are private by default, a honeymoon itinerary can set its own pace — a slower start each morning, a private dinner arranged through your guide, or a detour to a quieter monastery with fewer visitors.",
                ],
            },
            {
                heading: "Where couples usually go",
                paragraphs: [
                    "A 7 to 10 day route through Paro, Thimphu and Punakha covers the classic highlights at an easy pace, with boutique and luxury stays available in each town. Couples wanting more privacy often add a night or two in the Phobjikha valley.",
                ],
            },
        ],
        primaryLink: {
            label: "Browse Bhutan tour packages for couples",
            href: "/tours",
        },
        faqs: [
            {
                question: "Can we customise a Bhutan honeymoon itinerary?",
                answer:
                    "Yes. Every package can be adjusted for pace, hotel category and privacy — tell us it's a honeymoon when you enquire and we will shape the itinerary around that.",
            },
            {
                question: "What is the best time for a Bhutan honeymoon?",
                answer:
                    "Spring and autumn offer the clearest weather and the festivals, but winter and summer are quieter and often better value for a private trip.",
            },
        ],
    },
    {
        slug: "bhutan-tour-packages-from-singapore",
        title: "Bhutan Tour Packages from Singapore — Flights, Visa & Itineraries",
        heading: "Bhutan Tour Packages from Singapore",
        description:
            "Plan a Bhutan trip from Singapore: the direct Drukair connection to Paro, visa handling, the daily Sustainable Development Fee, and itineraries suited to a short break.",
        intro:
            "Singapore has a direct Drukair connection to Paro, which makes Bhutan more reachable from Singapore than from almost anywhere else outside the region.",
        sections: [
            {
                heading: "Getting there",
                paragraphs: [
                    "Drukair operates a through flight between Singapore and Paro, typically with a brief technical stop en route, several times a week. Seats are limited, so confirm the current schedule and book early.",
                ],
            },
            {
                heading: "Visa and fees",
                paragraphs: [
                    "Singapore passport holders need a Bhutanese tourist visa, arranged by your licensed operator, plus the Sustainable Development Fee of US$100 per person per night — both included in a standard package.",
                ],
            },
            {
                heading: "Itineraries for a short break",
                paragraphs: [
                    "With a direct flight connection, Bhutan suits a short 4 to 6 day trip from Singapore covering Paro and Thimphu, as well as longer 7 to 10 day itineraries that add Punakha and central Bhutan.",
                ],
            },
        ],
        primaryLink: {
            label: "Browse Bhutan tour packages",
            href: "/tours",
        },
        faqs: [
            {
                question: "Is there a direct flight from Singapore to Bhutan?",
                answer:
                    "Yes. Drukair operates a through service between Singapore and Paro several times a week, usually with a brief technical stop — confirm the current schedule when you plan.",
            },
            {
                question: "Do Singapore citizens need a visa for Bhutan?",
                answer:
                    "Yes. A Bhutanese tourist visa is required and is arranged by your licensed tour operator as part of your package, along with the Sustainable Development Fee.",
            },
        ],
    },
];

export function getGuide(slug: string): Guide | undefined {
    return guides.find((g) => g.slug === slug);
}
