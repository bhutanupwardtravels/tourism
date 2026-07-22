import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: "Privacy Policy",
    description:
        "How Bhutan Upward Travels collects, uses, and protects your personal information.",
    path: "/privacy",
});

const sections = [
    {
        title: "1. Who We Are",
        body: [
            "Bhutan Upward Travels is a licensed travel and tour operator based in Thimphu, Kingdom of Bhutan. We are committed to protecting the privacy and personal data of our clients, website visitors, and enquirers.",
            "This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to your data.",
        ],
    },
    {
        title: "2. Information We Collect",
        body: [
            "We may collect the following categories of personal information:",
            "• Identity data: name, passport number, nationality, date of birth\n• Contact data: email address, phone number, postal address\n• Travel data: travel dates, destination preferences, dietary requirements, medical disclosures\n• Financial data: billing information (processed securely via third-party payment providers — we do not store card details)\n• Usage data: pages visited, time on site, referral source, device and browser information (collected via cookies)",
        ],
    },
    {
        title: "3. How We Collect Your Information",
        body: [
            "We collect information directly from you when you: submit an enquiry or booking request, fill in the 'Plan My Trip' form, communicate with us by email or phone, or subscribe to our newsletter.",
            "We also collect technical data automatically as you browse our website, using cookies and similar tracking technologies. See Section 8 for more on cookies.",
        ],
    },
    {
        title: "4. How We Use Your Information",
        body: [
            "We use your personal data for the following purposes:",
            "• Processing and managing your booking or enquiry\n• Arranging Bhutan tourist visas and Sustainable Development Fee (SDF) payments on your behalf\n• Communicating tour details, itineraries, and travel documentation\n• Complying with Bhutanese government tourism regulations\n• Sending marketing communications (only with your explicit consent)\n• Improving our website and services through anonymised analytics",
        ],
    },
    {
        title: "5. Legal Basis for Processing",
        body: [
            "We process your personal data on the following legal grounds: performance of a contract (your booking), compliance with legal obligations (tourism regulations in Bhutan), your consent (marketing emails), and our legitimate interests (website improvement and fraud prevention).",
        ],
    },
    {
        title: "6. Sharing Your Information",
        body: [
            "We do not sell, rent, or trade your personal data. We may share your information with:",
            "• Tourism Council of Bhutan and relevant Bhutanese government authorities (required for visa processing and SDF payment)\n• Accommodation providers, transport operators, and local guides forming part of your itinerary\n• Third-party service providers who assist with payment processing, email delivery, and website hosting — all bound by strict data processing agreements\n• Professional advisers where legally required",
            "International transfers of data are carried out with appropriate safeguards in place.",
        ],
    },
    {
        title: "7. Data Retention",
        body: [
            "We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including for satisfying any legal, accounting, or reporting requirements. Booking records are typically retained for seven years in accordance with financial record-keeping obligations.",
            "You may request deletion of your data at any time (subject to legal retention obligations) by contacting us at the details below.",
        ],
    },
    {
        title: "8. Cookies",
        body: [
            "Our website uses cookies — small text files placed on your device — to enhance your browsing experience, remember preferences, and gather anonymised analytics on how visitors use the site.",
            "Essential cookies are required for the site to function and cannot be disabled. Analytics and preference cookies are optional. You can manage your cookie preferences through your browser settings at any time. Disabling non-essential cookies will not affect your ability to use this website.",
        ],
    },
    {
        title: "9. Your Rights",
        body: [
            "Depending on your country of residence, you may have the following rights regarding your personal data:",
            "• Right to access — request a copy of the data we hold about you\n• Right to rectification — request correction of inaccurate data\n• Right to erasure — request deletion of your data where we have no legal obligation to retain it\n• Right to restrict processing — request that we limit how we use your data\n• Right to data portability — receive your data in a commonly used format\n• Right to object — object to processing based on legitimate interests",
            "To exercise any of these rights, please contact us in writing using the details in Section 11. We will respond within 30 days.",
        ],
    },
    {
        title: "10. Security",
        body: [
            "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and to contact us immediately if you suspect any unauthorised use of your data.",
        ],
    },
    {
        title: "11. Contact & Complaints",
        body: [
            "If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:",
            "Bhutan Upward Travels\nThimphu, Kingdom of Bhutan\nEmail: use the contact form on our Enquire page",
            "If you are unsatisfied with our response, you have the right to lodge a complaint with the relevant data protection authority in your country of residence.",
        ],
    },
    {
        title: "12. Changes to This Policy",
        body: [
            "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with a revised date. We encourage you to review it periodically.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <PageHeader
                label="// legal"
                title="Privacy Policy"
                description="How we handle your personal information with care and transparency."
                bgText="Privacy"
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
                        <span>Questions about your data?</span>
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
