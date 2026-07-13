"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { ContactContent } from "@/lib/data/contact";

interface FooterProps {
  contact?: ContactContent | null;
}

export function Footer({ contact }: FooterProps) {
  const socialLinks = [
    { href: contact?.socials.instagram, icon: Instagram, label: "Instagram" },
    { href: contact?.socials.facebook, icon: Facebook, label: "Facebook" },
    { href: contact?.socials.twitter, icon: Twitter, label: "Twitter" },
    { href: contact?.socials.youtube, icon: Youtube, label: "YouTube" },
  ].filter((social) => !!social.href);

  return (
    <footer className="bg-black text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                <Image
                  src="/images/logo.png"
                  alt="Bhutan Upward Travels logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-2xl font-bold tracking-widest uppercase">
                  Bhutan Upward
                </span>
                <span className="block text-[10px] tracking-[0.3em] text-gray-400">
                  Travels
                </span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curating exceptional journeys to the Land of the Thunder Dragon.
              Experience the magic, culture, and serenity of Bhutan with us.
            </p>
            {(contact?.email || contact?.phone || contact?.address) && (
              <ul className="space-y-3 text-sm text-gray-400">
                {contact?.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact?.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-3 hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact?.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{contact.address}</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">
              Explore
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/destinations"
                  className="hover:text-gray-300 transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences"
                  className="hover:text-gray-300 transition-colors"
                >
                  Experiences
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-300 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">
              Support
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/enquire"
                  className="hover:text-gray-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-300 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">
                Begin Discovery
              </h4>
              <h3 className="text-3xl font-light tracking-tighter text-white uppercase italic serif leading-tight">
                Plan Your <span className="font-serif text-amber-500">Adventure</span>
              </h3>
            </div>

            <Link
              href="/plan-my-trip"
              className="group relative flex items-center justify-center gap-4 bg-white py-5 text-black text-[9px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-amber-600 hover:text-white overflow-hidden"
            >
              <span className="relative z-10">Start Planning</span>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-amber-500 transition-transform duration-500" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Bhutan Upward Travels. All rights
            reserved.
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
