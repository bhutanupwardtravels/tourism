"use client";

import { ShieldCheck, CalendarDays, UserCheck, PhoneCall, MapPin, Phone } from "lucide-react";
import type { Credentials, TrustItem } from "../schema";
import { Reveal } from "@/components/ui/reveal";

interface TrustCredentialsProps {
  credentials: Credentials;
  address?: string;
  phone?: string;
  whatsapp?: string;
}

interface Fact {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}

// Contact numbers are free-text admin input and often carry invisible bidi
// marks (e.g. pasted from WhatsApp) or inconsistent spacing, so two fields
// holding "the same" number can differ byte-for-byte. Compare digits only.
function sameNumber(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const digitsOf = (s: string) => s.replace(/\D/g, "");
  return digitsOf(a) === digitsOf(b);
}

export function TrustCredentials({ credentials, address, phone, whatsapp }: TrustCredentialsProps) {
  const facts: Fact[] = [
    credentials.licenseNumber && {
      icon: ShieldCheck,
      label: "Licensed Operator",
      value: credentials.licenseNumber,
    },
    credentials.foundingYear && {
      icon: CalendarDays,
      label: "Operating Since",
      value: credentials.foundingYear,
    },
    credentials.guideCredentials && {
      icon: UserCheck,
      label: "Guide Credentials",
      value: credentials.guideCredentials,
    },
    credentials.emergencySupport && {
      icon: PhoneCall,
      label: "Emergency Support",
      value: credentials.emergencySupport,
    },
    address && {
      icon: MapPin,
      label: "Office",
      value: address,
    },
    (phone || whatsapp) && {
      icon: Phone,
      label: "Reach Us",
      // Same number often serves as both phone and WhatsApp — don't repeat it.
      value:
        phone && whatsapp && !sameNumber(phone, whatsapp)
          ? `${phone} · ${whatsapp}`
          : (phone || whatsapp)!,
    },
  ].filter((fact): fact is Fact => Boolean(fact));

  const items: TrustItem[] = credentials.items || [];

  // Nothing supplied yet — render nothing rather than an empty shell.
  if (facts.length === 0 && items.length === 0) return null;

  const titleWords = credentials.title.split(" ");

  return (
    <section className="py-40 bg-neutral-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-linear-to-b from-amber-500/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <Reveal as="span" y={0}
            className="block font-mono text-amber-500 text-xs uppercase tracking-[0.5em] mb-6">
            // {credentials.subtitle || "why travel with us"}
          </Reveal>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-tight">
            {titleWords[0]}{" "}
            <span className="italic font-serif normal-case text-amber-500">
              {titleWords.slice(1).join(" ")}
            </span>
          </h2>
        </div>

        {facts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {facts.map((fact) => (
              <Reveal y={30} duration={0.8}
                key={fact.label}
                className="flex items-start gap-5 p-8 border border-white/5 bg-white/2 hover:border-amber-500/30 transition-all duration-700">
                <fact.icon className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">
                    {fact.label}
                  </p>
                  <p className="text-lg font-light text-white/90 leading-snug break-words">
                    {fact.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <Reveal y={30} delay={index * 0.1} duration={1}
                key={item.id}
                className="p-8 border border-white/5 bg-white/2 hover:border-amber-500/30 transition-all duration-700">
                <h4 className="text-xl font-light text-white mb-3 uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-gray-400 leading-relaxed font-light text-sm">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
