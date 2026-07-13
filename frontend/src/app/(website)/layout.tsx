import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getContactContent, ContactContent } from "@/lib/data/contact";

// Public pages are statically rendered and revalidated in the background.
// Admin actions additionally call revalidatePath for instant updates.
export const revalidate = 300;

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
