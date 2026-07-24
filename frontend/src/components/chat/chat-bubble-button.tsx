"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatBubbleButton({ open, onClick }: { open: boolean; onClick: () => void }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-label={open ? "Close chat" : "Open chat"}
            aria-expanded={open}
            aria-controls="chat-panel"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full",
                "bg-amber-600 text-white shadow-lg shadow-black/40 hover:bg-amber-500",
                "outline-none focus-visible:ring-[3px] focus-visible:ring-amber-600/50"
            )}
        >
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </motion.button>
    );
}
