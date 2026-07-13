import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { siteUrl, SITE_NAME } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl()),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description:
        "Curated journeys to the Land of the Thunder Dragon — tours, experiences, and stays across Bhutan.",
    openGraph: {
        siteName: SITE_NAME,
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
                suppressHydrationWarning
            >
                {children}


                <Toaster
                    position="top-right"
                    swipeDirections={["right"]}
                    richColors={true}
                />
                <SpeedInsights />
                <Analytics />

            </body>
        </html>
    );
}
