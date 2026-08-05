import Link from "next/link";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";

// Route group for the trip-planning portal. It deliberately does NOT use the
// public site's Header/Footer — this is a focused, app-like workspace rather
// than a marketing page. A single fixed landscape image backs the whole
// portal (top bar + content) instead of a flat white page.
export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

      {/* Slim portal top bar (transparent over the image) */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <Image
                src="/images/logo.png"
                alt="Bhutan Upward Travels logo"
                width={28}
                height={28}
                priority
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                Trip Planner
              </span>
              <span className="text-[10px] tracking-[0.3em] text-white/60">
                Bhutan Upward
              </span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
