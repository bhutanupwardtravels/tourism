import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Terms and conditions governing the use of Bhutan Upward Travels services and bookings.",
};

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: [
            "By accessing this website or booking any tour or service with Bhutan Upward Travels, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.",
            "These terms apply to all travellers, enquirers, and website visitors. We reserve the right to amend these terms at any time. Continued use of our services after an update constitutes acceptance of the revised terms.",
        ],
    },
    {
        title: "2. Bookings & Payments",
        body: [
            "All tour bookings are subject to availability and confirmation by Bhutan Upward Travels. A booking is only confirmed once you have received a written confirmation from us and the applicable deposit has been received.",
            "A non-refundable deposit of 30% of the total tour cost is required to secure your booking. The remaining balance is due no later than 60 days prior to your travel date. For bookings made within 60 days of departure, full payment is required at the time of booking.",
            "Prices quoted are in US Dollars (USD) and are based on costs at the time of quotation. We reserve the right to adjust prices in the event of significant currency fluctuations, fuel surcharges, or increases in government-mandated fees — including the Bhutan Sustainable Development Fee (SDF).",
        ],
    },
    {
        title: "3. Cancellations & Refunds",
        body: [
            "Cancellations must be submitted in writing to our team. The following cancellation fees apply based on the number of days prior to departure:",
            "• 60+ days: Loss of deposit only\n• 30–59 days: 50% of total tour cost\n• 15–29 days: 75% of total tour cost\n• 0–14 days: 100% of total tour cost (no refund)",
            "Bhutan Upward Travels reserves the right to cancel a tour due to insufficient participant numbers, adverse weather, political unrest, or force majeure events. In such cases, a full refund of amounts paid will be provided, but we accept no further liability for consequential costs such as flights or visas.",
        ],
    },
    {
        title: "4. Bhutan Government Fees & Visa",
        body: [
            "All visitors to Bhutan (except citizens of India, Bangladesh, and Maldives) are required to pay the Sustainable Development Fee (SDF) as mandated by the Royal Government of Bhutan. This fee is subject to change at the government's discretion and is non-refundable once paid.",
            "You are responsible for obtaining the appropriate travel documents, including a Bhutan Tourist Visa, which is processed by our team upon booking confirmation. Visa issuance is subject to approval by the Tourism Council of Bhutan. We accept no responsibility for visa denials.",
        ],
    },
    {
        title: "5. Travel Insurance",
        body: [
            "Travel insurance is strongly recommended and may be required for certain itineraries. Your policy should cover trip cancellation, medical emergencies, evacuation, and loss of personal belongings. Bhutan Upward Travels is not liable for costs arising from failure to obtain adequate insurance.",
        ],
    },
    {
        title: "6. Health, Safety & Client Responsibilities",
        body: [
            "You are responsible for ensuring you are medically fit to undertake your chosen itinerary. Bhutan involves high-altitude trekking and remote terrain. Please consult your physician before booking. Any pre-existing medical conditions must be disclosed at the time of booking.",
            "Clients are expected to behave in a manner respectful of Bhutanese culture, customs, and laws. Bhutan Upward Travels reserves the right to remove any traveller from a tour for misconduct without refund.",
        ],
    },
    {
        title: "7. Limitation of Liability",
        body: [
            "Bhutan Upward Travels acts as an organiser of travel services and is not directly liable for the acts, omissions, or negligence of third-party service providers including airlines, hotels, and local transport operators.",
            "Our liability in any event is limited to the total amount paid by you for the specific service in dispute. We shall not be liable for indirect, special, or consequential losses of any nature.",
        ],
    },
    {
        title: "8. Intellectual Property",
        body: [
            "All content on this website — including text, photographs, itineraries, and design — is the intellectual property of Bhutan Upward Travels. Reproduction or redistribution without written permission is prohibited.",
        ],
    },
    {
        title: "9. Governing Law",
        body: [
            "These Terms and Conditions are governed by and construed in accordance with the laws of the Kingdom of Bhutan. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Thimphu, Bhutan.",
        ],
    },
    {
        title: "10. Contact",
        body: [
            "For any questions regarding these Terms and Conditions, please contact us via the details provided on our Contact page. We aim to respond to all enquiries within two business days.",
        ],
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <PageHeader
                label="// legal"
                title="Terms & Conditions"
                description="Please read these terms carefully before booking or using any of our services."
                bgText="Terms"
            />

            <div className="container mx-auto px-6 pb-24">
                <div className="max-w-3xl">
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-16">
                        Last updated: {new Date().getFullYear()}
                    </p>

                    <div className="space-y-12">
                        {sections.map((section) => (
                            <div key={section.title} className="space-y-4">
                                <h2 className="text-lg font-semibold tracking-tight border-b border-gray-100 pb-3">
                                    {section.title}
                                </h2>
                                <div className="space-y-4">
                                    {section.body.map((paragraph, i) => (
                                        <p
                                            key={i}
                                            className="text-gray-600 leading-relaxed text-sm whitespace-pre-line"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                        <span>Have questions about these terms?</span>
                        <a
                            href="/enquire"
                            className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                        >
                            Contact our team →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
