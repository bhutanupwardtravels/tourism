"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Admin error]", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="p-4 rounded-full bg-red-50">
                <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-black">Something went wrong</h2>
                <p className="text-sm text-gray-500 max-w-sm">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
                {error.digest && (
                    <p className="text-xs text-gray-400 font-mono">ID: {error.digest}</p>
                )}
            </div>
            <Button
                onClick={reset}
                className="rounded-none bg-black hover:bg-gray-800 text-white"
            >
                Try again
            </Button>
        </div>
    );
}
