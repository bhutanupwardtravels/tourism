"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    // Log the error for debugging (optional)
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-white flex items-center justify-center p-6"
        >
            <div className="max-w-xl w-full text-center space-y-8">
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
                        <path d="M12 9v2m0 4h.01" />
                        <circle cx={12} cy={12} r={10} />
                    </svg>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-light text-black tracking-tight uppercase">
                    System <span className="italic font-serif text-amber-600 normal-case">Error</span>
                </h1>
                <p className="text-lg text-gray-500 font-light italic">
                    "We encountered an unexpected disruption in your journey. Please allow us a moment to realign."
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        onClick={reset}
                        className={cn(
                            "group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-amber-600 transition-colors",
                        )}
                    >
                        Retry Connection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className={cn(
                            "group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors",
                        )}
                    >
                        Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
