"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnimatedArrowLeftHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AnimatedArrowLeftProps {
  className?: string;
}

export const AnimatedArrowLeft = React.forwardRef<
  AnimatedArrowLeftHandle,
  AnimatedArrowLeftProps
>(({ className }, ref) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    startAnimation: () => setIsAnimating(true),
    stopAnimation: () => setIsAnimating(false),
  }));

  return (
    <ArrowLeft
      className={cn(
        "transition-transform duration-300",
        isAnimating && "animate-[wiggle_0.5s_ease-in-out]",
        className
      )}
      style={{
        animation: isAnimating ? "wiggle 0.5s ease-in-out infinite" : "none",
      }}
    />
  );
});

AnimatedArrowLeft.displayName = "AnimatedArrowLeft";
