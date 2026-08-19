"use client";

import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ElementType,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-entrance animation whose *resting state is the visible state*.
 *
 * The pattern this replaces — `<motion.div initial={{ opacity: 0 }}
 * whileInView={{ opacity: 1 }}>` — serialises `opacity: 0` into the
 * server-rendered HTML. That means the content is hidden in the document
 * itself and only becomes visible once React has hydrated and Framer Motion's
 * IntersectionObserver has fired. On a slow device, a throttled connection, or
 * with JS disabled, the page is simply blank.
 *
 * `Reveal` inverts the dependency:
 *
 *  - Server render and first client render emit no opacity or transform at
 *    all, so the HTML is readable the instant it paints.
 *  - After mount (in a layout effect, before the browser paints) it measures
 *    itself. If it is already on screen it stays exactly as rendered — no
 *    flash, and the LCP element is never re-hidden.
 *  - Only elements confirmed to be below the fold get hidden and then
 *    animated in as they scroll into view.
 *  - If `prefers-reduced-motion` is set, nothing moves and nothing hides.
 *
 * Worst case (JS never runs) is the whole page visible and static, which is
 * the correct failure mode for a marketing site.
 */

type RevealOwnProps<E extends ElementType> = {
    /** Element to render. Defaults to `div`. */
    as?: E;
    children?: ReactNode;
    className?: string;
    /** Distance in px the element rises from. */
    y?: number;
    /** Distance in px the element slides from (negative = from the left). */
    x?: number;
    /** Starting scale, e.g. 0.9. */
    scale?: number;
    /** Seconds before the transition starts. */
    delay?: number;
    /** Seconds the transition runs for. */
    duration?: number;
};

export type RevealProps<E extends ElementType> = RevealOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof RevealOwnProps<E>>;

/** `useLayoutEffect` warns during SSR; on the server there is nothing to measure. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Ceilings, applied to whatever a caller passes.
 *
 * A reveal is only ever decoration on content that is already in the HTML, so
 * its budget is "long enough to read as motion, short enough that a scroller
 * never meets it". Past roughly 0.4s a fast scroll outruns the animation and
 * lands on blank space, which reads as "not loaded" — and the response to that
 * is another scroll or a back-click, not patience. Staggered delays compound
 * the same problem down a grid: at 0.1s per card the sixth card starts half a
 * second after the first, so the bottom of the row is empty while the top is
 * settled.
 *
 * Clamped centrally rather than at the ~40 call sites so a future
 * `duration={1}` cannot quietly reintroduce it.
 */
const MAX_DURATION = 0.3;
const MAX_DELAY = 0.15;

/**
 * An element taller than this fraction of the viewport is not "an element
 * animating in" — it *is* the screen. Hiding it means the viewport is blank.
 */
const MAX_VIEWPORT_FRACTION = 0.5;

export function Reveal<E extends ElementType = "div">({
    as,
    children,
    className,
    y = 24,
    x = 0,
    scale,
    delay = 0,
    duration = 0.3,
    style,
    ...rest
}: RevealProps<E>) {
    const clampedDuration = Math.min(duration, MAX_DURATION);
    const clampedDelay = Math.min(delay, MAX_DELAY);
    const Tag = (as ?? "div") as ElementType;
    const ref = useRef<HTMLElement | null>(null);
    // "static" is the SSR state: no inline opacity, no transform, fully visible.
    const [phase, setPhase] = useState<"static" | "hidden" | "shown">("static");

    useIsomorphicLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (typeof IntersectionObserver === "undefined") return;

        // Anything already in (or within a screen of) the viewport keeps the
        // state it was server-rendered in. Hiding it now would be a flash, and
        // for above-the-fold content it would delay the largest paint.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) return;

        // Big blocks stay put: fading a half-screen element in means a
        // half-screen of nothing while it does so.
        if (rect.height > window.innerHeight * MAX_VIEWPORT_FRACTION) return;

        setPhase("hidden");

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setPhase("shown");
                    observer.disconnect();
                }
            },
            { rootMargin: "0px 0px -10% 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const motionStyle: CSSProperties =
        phase === "static"
            ? {}
            : {
                  opacity: phase === "hidden" ? 0 : 1,
                  transform:
                      phase === "hidden"
                          ? `translate3d(${x}px, ${y}px, 0)${scale ? ` scale(${scale})` : ""}`
                          : "none",
                  transition: `opacity ${clampedDuration}s ${EASE} ${clampedDelay}s, transform ${clampedDuration}s ${EASE} ${clampedDelay}s`,
              };

    return (
        <Tag
            ref={ref}
            className={cn(className)}
            style={{ ...motionStyle, ...(style as CSSProperties) }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
