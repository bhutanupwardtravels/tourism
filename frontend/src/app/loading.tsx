import Image from "next/image";

export default function Loading() {
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-center bg-white gap-10"
            role="status"
            aria-label="Loading"
        >

            {/* Spinner */}
            <div className="relative flex h-20 w-20 items-center justify-center">
                <div
                    className="absolute inset-0 rounded-full border border-stone-200 border-t-amber-500"
                    style={{ animation: "spin 1.6s linear infinite" }}
                />
                <Image
                    src="/images/logo.png"
                    alt="Bhutan Upward Travels"
                    width={56}
                    height={56}
                    className="object-contain opacity-90"
                    priority
                />

            </div>

            {/* Label */}
            <div className="flex flex-col items-center gap-3">
                <div className="h-px w-8 bg-black/10" />
                <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-600/80 animate-pulse">
                    // Bhutan Upward Travels
                </p>
                 <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-600/80 animate-pulse">
                    Welcomes You
                </p>
                <div className="h-px w-8 bg-black/10" />
            </div>

            <span className="sr-only">Loading...</span>
        </main>
    );
}
