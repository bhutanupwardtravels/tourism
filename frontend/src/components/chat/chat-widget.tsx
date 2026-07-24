"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Send, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubbleButton } from "./chat-bubble-button";
import { ChatMessage as ChatMessageBubble, TypingIndicator } from "./chat-message";

export interface ChatMessage {
    role: "user" | "model";
    content: string;
    isError?: boolean;
}

const RATE_LIMIT_MESSAGE = "You're sending messages too fast — please wait a moment and try again.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again in a moment.";

export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [streaming, setStreaming] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, loading]);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    async function sendMessage() {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: ChatMessage = { role: "user", content: trimmed };
        const historyForRequest = messages.filter((m) => !m.isError);

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed, history: historyForRequest }),
            });

            if (!res.ok || !res.body) {
                const data = await res.json().catch(() => null);
                console.error("Chat request failed:", res.status, data?.error);
                const text = res.status === 429 ? RATE_LIMIT_MESSAGE : GENERIC_ERROR_MESSAGE;
                setMessages((prev) => [...prev, { role: "model", content: text, isError: true }]);
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let started = false;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (!chunk) continue;

                if (!started) {
                    started = true;
                    setStreaming(true);
                    setMessages((prev) => [...prev, { role: "model", content: chunk }]);
                } else {
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            ...next[next.length - 1],
                            content: next[next.length - 1].content + chunk,
                        };
                        return next;
                    });
                }
            }

            if (!started) {
                setMessages((prev) => [...prev, { role: "model", content: GENERIC_ERROR_MESSAGE, isError: true }]);
            }
        } catch (err) {
            console.error("Chat request threw:", err);
            setMessages((prev) => [...prev, { role: "model", content: GENERIC_ERROR_MESSAGE, isError: true }]);
        } finally {
            setLoading(false);
            setStreaming(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            <ChatBubbleButton open={open} onClick={() => setOpen((o) => !o)} />
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="chat-panel"
                        role="dialog"
                        aria-label="Chat with support"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed bottom-24 right-6 z-50 flex h-[32rem] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-black/20"
                    >
                        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-neutral-200">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Bhutan Upward Travels logo"
                                        width={20}
                                        height={20}
                                        className="size-5 object-contain"
                                    />
                                </span>
                                <span className="text-sm font-medium text-neutral-900">Bhutan Upward Travels</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Close chat"
                                onClick={() => setOpen(false)}
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>

                        <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                            {messages.length === 0 && (
                                <p className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2 text-sm text-neutral-800">
                                    Kuzu Zangpo La! Ask me anything about touring Bhutan — visas, the SDF, best time
                                    to visit, or planning your trip.
                                </p>
                            )}
                            {messages.map((m, i) => (
                                <ChatMessageBubble key={i} {...m} />
                            ))}
                            {loading && !streaming && <TypingIndicator />}
                        </div>

                        <div className="flex items-center gap-2 border-t border-neutral-200 p-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                placeholder="Type your message..."
                                className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-amber-600/50 disabled:opacity-50"
                            />
                            <Button
                                type="button"
                                size="icon"
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                aria-label="Send message"
                                className="rounded-xl bg-amber-600 hover:bg-amber-500"
                            >
                                <Send className="size-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
