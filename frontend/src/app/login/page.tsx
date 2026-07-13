"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loginAction } from "./actions";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await loginAction(email, password);

            if (result?.error) {
                console.error("Login error:", result.error);
                toast.error(result.error);
            } else {
                toast.success("Welcome back, Admin");
                router.push("/admin/experiences");
                router.refresh();
            }
        } catch (error) {
            console.error("Sign in exception:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2952&auto=format&fit=crop')] bg-cover bg-center opacity-10 saturate-[0.5]" />
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-white" />

            {/* Background Decorative Waves */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <svg
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0 w-full h-[120%] text-neutral-100 fill-current opacity-60"
                    preserveAspectRatio="none"
                >
                    <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <svg
                    viewBox="0 0 1440 320"
                    className="absolute bottom-10 left-0 w-full h-full text-neutral-50 fill-current"
                    preserveAspectRatio="none"
                >
                    <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,165.3C960,160,1056,96,1152,101.3C1248,107,1344,181,1392,218.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            {/* Background Grid - Minimalist Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[60px_60px]" />
            </div>

            {/* Floating Geometric Shapes - Light Theme Adapted */}
            <motion.div
                className="absolute top-20 left-10 w-32 h-32 border border-black/5 rounded-full"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute top-40 right-20 w-24 h-24 border border-amber-500/10 rotate-45"
                animate={{
                    y: [0, 20, 0],
                    rotate: [45, 40, 45],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-20 left-1/4 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"
                animate={{
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-40 right-1/3 w-28 h-28 border border-black/5"
                animate={{
                    y: [0, 15, 0],
                    x: [0, -10, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Narrative ID Overlay */}
            <div className="absolute top-20 right-10 font-mono text-[10px] text-gray-400 uppercase tracking-[0.6em] writing-mode-vertical-rl rotate-180 select-none">
                PROTOCOL // REQ-2025
            </div>


            {/* Main Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white border border-gray-100 shadow-2xl relative z-10"
            >
                {/* Header with animated border */}
                <div className="relative border-b border-gray-100 p-8">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-0.5 bg-black"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="w-16 h-16 flex items-center justify-center mx-auto mb-4 relative"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Bhutan Upward Travels logo"
                                width={64}
                                height={64}
                                priority
                                className="h-16 w-16 object-contain"
                            />
                        </motion.div>
                        <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.3em] mb-2 block">
                            // SECURE ACCESS
                        </span>
                        <h1 className="text-2xl font-light text-black tracking-tighter uppercase">Bhutan Upward Admin</h1>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field - Updated from Username */}
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-b border-gray-200 py-3 text-sm text-black focus:outline-none focus:border-black transition-all bg-transparent group-hover:border-gray-300 placeholder:text-gray-300"
                                    placeholder="ENTER EMAIL ADDRESS"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-b border-gray-200 py-3 pr-12 text-sm text-black focus:outline-none focus:border-black transition-all bg-transparent group-hover:border-gray-300 placeholder:text-gray-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "w-full group relative inline-flex items-center justify-center gap-2 bg-black px-8 py-5 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-amber-600 overflow-hidden",
                                    isLoading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                <span className="relative z-10">{isLoading ? "AUTHENTICATING..." : "ACCESS PORTAL"}</span>
                                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-amber-500 transition-transform duration-500" />
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                        <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-mono">
                            Bhutan Upward Travels © 2025
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
