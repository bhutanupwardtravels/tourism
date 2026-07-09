"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-white flex items-center justify-center p-6"
        >
            <div className="max-w-lg w-full text-center space-y-8">
                <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shadow-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                    <svg
                        className="w-16 h-16 text-amber-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-light text-black tracking-tight uppercase">
                    404 <span className="italic font-serif text-amber-600 normal-case">Lost</span>
                </h1>
                <p className="text-lg text-gray-500 font-light italic">
                    "The path you seek has faded into the mist. Better to return to known lands."
                </p>
                <button
                    onClick={() => (window.location.href = "/")}
                    className={cn(
                        "group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-amber-600 transition-colors"
                    )}
                >
                    Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
