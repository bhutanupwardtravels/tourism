import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { MotionProvider } from "@/components/layout/motion-provider";
import { PortalChrome } from "./portal-chrome";
import { getContactContent, type ContactContent } from "@/lib/data/contact";
import { getAboutContent } from "@/lib/data/about";

// Route group for the trip-planning portal. A single fixed landscape image
// backs the whole portal (chrome + content) instead of a flat white page.
// The header is chosen per screen by PortalChrome: the public site header
// while the traveller is still choosing, a slim app bar once they are
// building an itinerary day by day.
export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let contact: ContactContent | null = null;
  let licenseNumber: string | undefined;
  try {
    const [contactContent, aboutContent] = await Promise.all([
      getContactContent(),
      getAboutContent(),
    ]);
    contact = contactContent;
    licenseNumber = aboutContent.credentials.licenseNumber || undefined;
  } catch {
    // The planner must render even if the contact/about tables are unreachable
  }

  return (
    <div className="relative min-h-screen flex flex-col text-white">
      {/* Full-portal fixed background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/Bhutan-Travel-Guide.jpg"
          alt="Bhutanese Aerial Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/85" />
      </div>

      <NextTopLoader color="#d97706" height={2} showSpinner={false} />

      <MotionProvider>
        <PortalChrome contact={contact} licenseNumber={licenseNumber}>
          {children}
        </PortalChrome>
      </MotionProvider>
    </div>
  );
}
