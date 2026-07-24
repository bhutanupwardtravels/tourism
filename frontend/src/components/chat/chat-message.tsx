import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "./chat-widget";

const markdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
    a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">
            {children}
        </a>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="rounded bg-black/5 px-1 py-0.5 text-xs">{children}</code>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
        <div className="mb-2 overflow-x-auto last:mb-0">
            <table className="w-full border-collapse text-xs">{children}</table>
        </div>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
        <th className="border-b border-neutral-300 px-2 py-1 text-left font-semibold">{children}</th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
        <td className="border-b border-neutral-200 px-2 py-1">{children}</td>
    ),
};

export function ChatMessage({ role, content, isError }: ChatMessageType) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm",
                isUser
                    ? "ml-auto whitespace-pre-wrap rounded-br-sm bg-amber-600 text-white"
                    : "mr-auto rounded-bl-sm bg-neutral-100 text-neutral-800",
                isError && "border border-red-300 bg-red-50 text-red-700"
            )}
        >
            {isUser ? (
                content
            ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {content}
                </ReactMarkdown>
            )}
        </div>
    );
}

export function TypingIndicator() {
    return (
        <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2.5">
            <Bot className="size-3.5 text-amber-600" />
            <span className="flex items-center gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-neutral-400" />
            </span>
        </div>
    );
}
