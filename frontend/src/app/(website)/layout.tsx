import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";
import { getContactContent, ContactContent } from "@/lib/data/contact";
import { JsonLd } from "@/components/common/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
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
  try {
    contact = await getContactContent();
  } catch {
    // Site must render even if the contact table is missing/unreachable
  }

  return (
    <>
      <JsonLd data={organizationJsonLd(contact)} />
      <JsonLd data={websiteJsonLd()} />
      <NextTopLoader color="#d97706" height={2} showSpinner={false} />
      <Header contact={contact} />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer contact={contact} />
    </>
  );
}
