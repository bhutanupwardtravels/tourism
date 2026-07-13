import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getContactContent, ContactContent } from "@/lib/data/contact";

export const dynamic = "force-dynamic";

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
