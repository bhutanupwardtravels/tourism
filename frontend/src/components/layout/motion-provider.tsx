"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion drives inline styles from JS, so the `prefers-reduced-motion`
 * block in globals.css can't reach it — CSS only governs CSS animations and
 * transitions. `reducedMotion="user"` makes every `motion.*` element in the
 * tree honour the OS setting: transform and layout animation is skipped while
 * opacity still cross-fades, so content appears rather than snapping in.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
