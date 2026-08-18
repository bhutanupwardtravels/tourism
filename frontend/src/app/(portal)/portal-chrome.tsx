"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import type { ContactContent } from "@/lib/data/contact";

// The portal has two chrome modes.
//
// "site" is the default and covers every screen where the traveller is still
// deciding — the mode picker, the package list, the enquiry form. Those screens
// need the normal header and the usual trust artefacts; swapping the navigation
// out from under someone the moment they click "Plan my trip" reads as having
// left the site, and it strips the licence number and phone number at exactly
// the point they are deciding whether to hand over their details.
//
// "workspace" is the slim, app-like bar, and is entered only once the traveller
// is actually building an itinerary day by day, where the marketing header is
// genuinely in the way.
type ChromeMode = "site" | "workspace";

const PortalChromeContext = createContext<(mode: ChromeMode) => void>(() => {});

/**
 * Declares which chrome the current portal screen wants. Safe to call from any
 * depth; it resets to "site" when the calling component unmounts.
 */
export function usePortalChrome(mode: ChromeMode) {
  const setMode = useContext(PortalChromeContext);
  useEffect(() => {
    setMode(mode);
    return () => setMode("site");
  }, [mode, setMode]);
}

interface PortalChromeProps {
  contact: ContactContent | null;
  licenseNumber?: string;
  children: React.ReactNode;
}

export function PortalChrome({ contact, licenseNumber, children }: PortalChromeProps) {
  const [mode, setMode] = useState<ChromeMode>("site");

  return (
    <PortalChromeContext.Provider value={setMode}>
      {mode === "site" ? (
        <>
          <Header contact={contact} />
          {/* The public header is fixed, so the portal has to reserve its height. */}
          <div className="h-24 lg:h-28 shrink-0" aria-hidden="true" />
        </>
      ) : (
        <WorkspaceBar />
      )}

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <PortalTrustFooter contact={contact} licenseNumber={licenseNumber} />
    </PortalChromeContext.Provider>
  );
}

function WorkspaceBar() {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-sm">
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

        {/*
          The builder used to be a dead end — the logo was the only link out.
          Someone mid-build who wants to re-check a hotel or a destination
          needs a way across without losing their place.
        */}
        <nav className="ml-auto flex items-center gap-6">
          {[
            { href: "/tours", label: "Tours" },
            { href: "/destinations", label: "Destinations" },
            { href: "/hotels", label: "Hotels" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden text-xs font-medium uppercase tracking-wider text-white/70 transition-colors hover:text-white sm:inline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/enquire"
            className="text-xs font-medium uppercase tracking-wider text-amber-500 transition-colors hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Talk to a specialist
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Compact reassurance strip. It stays on every portal screen, including the
// builder, so the licensing and contact details never disappear at the point
// where the traveller is being asked to commit.
function PortalTrustFooter({
  contact,
  licenseNumber,
}: {
  contact: ContactContent | null;
  licenseNumber?: string;
}) {
  const whatsappDigits = contact?.whatsapp?.replace(/[^0-9]/g, "");

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:px-6">
        <span className="font-medium text-white/90">
          A specialist replies within 24 business hours.
        </span>

        {licenseNumber && (
          <span>
            Licensed Bhutanese tour operator · Licence {licenseNumber}
          </span>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:ml-auto">
          {contact?.phone && (
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              {contact.phone}
            </a>
          )}
          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              WhatsApp {contact!.whatsapp}
            </a>
          )}
          {contact?.email && (
            <a
              href={`mailto:${contact.email}`}
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
