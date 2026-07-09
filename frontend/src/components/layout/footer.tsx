"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="block">
              <span className="text-2xl font-bold tracking-widest uppercase">
                Bhutan
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-gray-400">
                Kingdom of Happiness
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curating exceptional journeys to the Land of the Thunder Dragon.
              Experience the magic, culture, and serenity of Bhutan with us.
            </p>
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
            &copy; {new Date().getFullYear()} Bhutan Tourism. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
