"use client";

interface RequestMessageProps {
    message?: string;
}

export function RequestMessage({ message }: RequestMessageProps) {
    if (!message) return null;

    return (
        <div className="space-y-6 pt-8 border-t border-gray-200">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                Message
            </h3>
            <div className="relative">
                <span className="absolute -top-4 -left-2 text-4xl font-serif text-gray-100 italic select-none">"</span>
                <p className="text-sm text-gray-500 leading-relaxed italic relative z-10 pl-4">{message}</p>
            </div>
        </div>
    );
}
