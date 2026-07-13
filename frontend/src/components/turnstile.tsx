"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: Record<string, unknown>) => string;
            remove: (id: string) => void;
            reset: (id?: string) => void;
        };
    }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileProps {
    onVerify: (token: string) => void;
    onExpire?: () => void;
}

/**
 * Cloudflare Turnstile widget. Renders nothing (and calls onVerify with a dummy
 * token so submission isn't blocked) when NEXT_PUBLIC_TURNSTILE_SITE_KEY is
 * absent — e.g. local dev without keys. Server-side verification is skipped in
 * the same case, so the two stay consistent.
 */
export function Turnstile({ onVerify, onExpire }: TurnstileProps) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!siteKey) {
            // No key configured: don't gate the form.
            onVerify("dev-no-turnstile");
            return;
        }

        let cancelled = false;

        const renderWidget = () => {
            if (cancelled || !containerRef.current || !window.turnstile) return;
            if (widgetIdRef.current) return; // already rendered
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: (token: string) => onVerify(token),
                "expired-callback": () => onExpire?.(),
                "error-callback": () => onExpire?.(),
            });
        };

        if (window.turnstile) {
            renderWidget();
        } else if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
            const script = document.createElement("script");
            script.src = SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            script.onload = renderWidget;
            document.head.appendChild(script);
        } else {
            // Script tag exists but API not ready yet — poll briefly.
            const interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    renderWidget();
                }
            }, 200);
            return () => clearInterval(interval);
        }

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch {
                    // widget already gone
                }
                widgetIdRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    if (!siteKey) return null;
    return <div ref={containerRef} className="cf-turnstile" />;
}
