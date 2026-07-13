import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getContactContent, ContactContent } from "@/lib/data/contact";

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
      <Header contact={contact} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer contact={contact} />
    </>
  );
}
