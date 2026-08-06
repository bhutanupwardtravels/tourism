import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";
import { getContactContent, ContactContent } from "@/lib/data/contact";
import { getAboutContent } from "@/lib/data/about";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { JsonLd } from "@/components/common/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { ChatWidget } from "@/components/chat/chat-widget";
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
  try {
    const [contactContent, aboutContent, featuredTestimonials] = await Promise.all([
      getContactContent(),
      getAboutContent(),
      getFeaturedTestimonials(20),
    ]);
    contact = contactContent;
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
      <Header contact={contact} />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer contact={contact} />
      <ChatWidget />
    </>
  );
}
