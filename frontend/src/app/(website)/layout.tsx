import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";
import { MotionProvider } from "@/components/layout/motion-provider";
import { getContactContent, ContactContent } from "@/lib/data/contact";
import { getAboutContent } from "@/lib/data/about";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { JsonLd } from "@/components/common/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { ChatWidget } from "@/components/chat/chat-widget";
import { PromoBanner } from "@/components/promo/promo-banner";
import { getActiveBannerCampaign } from "@/lib/data/promo-campaigns";
import { PublicCampaign } from "@/components/promo/types";
import NextTopLoader from "nextjs-toploader";

// Public pages are statically rendered and revalidated in the background.
// Admin mutations call revalidatePath for instant propagation, so a long
// background TTL is safe and keeps ISR writes well under Vercel limits.
export const revalidate = 3600;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let contact: ContactContent | null = null;
  let credentials: { founderName?: string; foundingYear?: string; licenseNumber?: string } | undefined;
  let testimonials: { name: string; quote: string; rating: number }[] = [];
  let campaign: PublicCampaign | null = null;
  try {
    const [contactContent, aboutContent, featuredTestimonials, activeCampaign] = await Promise.all([
      getContactContent(),
      getAboutContent(),
      getFeaturedTestimonials(20),
      getActiveBannerCampaign(),
    ]);
    contact = contactContent;
    // Only the fields the banner needs cross to the client. The window is
    // re-checked there against the real clock — this layout is ISR'd for an
    // hour, so a server-only check could leave a finished campaign up.
    campaign = activeCampaign
      ? {
          id: activeCampaign._id ?? activeCampaign.id ?? "",
          discountPercent: activeCampaign.discountPercent,
          bannerHeadline: activeCampaign.bannerHeadline,
          bannerBody: activeCampaign.bannerBody,
          bannerCtaLabel: activeCampaign.bannerCtaLabel,
          bannerStartsAt: activeCampaign.bannerStartsAt ?? null,
          bannerEndsAt: activeCampaign.bannerEndsAt ?? null,
          couponValidDays: activeCampaign.couponValidDays,
          couponEligibleAfterDays: activeCampaign.couponEligibleAfterDays,
        }
      : null;
    credentials = {
      founderName: aboutContent.founder.name || undefined,
      foundingYear: aboutContent.credentials.foundingYear || undefined,
      licenseNumber: aboutContent.credentials.licenseNumber || undefined,
    };
    testimonials = featuredTestimonials;
  } catch {
    // Site must render even if the contact/about tables are missing/unreachable
  }

  return (
    <>
      <JsonLd data={organizationJsonLd(contact, credentials, testimonials)} />
      <JsonLd data={websiteJsonLd()} />
      <NextTopLoader color="#d97706" height={2} showSpinner={false} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:bg-black focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-amber-600"
      >
        Skip to content
      </a>
      <MotionProvider>
        <Header contact={contact} />
        <main id="main-content" className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer contact={contact} />
        <ChatWidget />
        <PromoBanner campaign={campaign} />
      </MotionProvider>
    </>
  );
}
