"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ImageProps } from "next/image";

// Drop-in replacement for next/image that shows a shimmer while loading
// and fades the real image in once it's ready.
// Must be used inside a `relative overflow-hidden` container when fill={true}.
export function FadeImage({ className, onLoad, priority, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!priority && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 img-shimmer transition-opacity duration-500 pointer-events-none",
            loaded && "opacity-0"
          )}
        />
      )}
      <Image
        {...props}
        priority={priority}
        className={cn(
          // Base classes first so caller-provided duration/easing overrides win in twMerge.
          // Tailwind v4 scale-* utilities animate the native `scale` property (not transform),
          // so it must be listed explicitly for hover zooms to transition smoothly.
          "transition-[opacity,transform,translate,scale,rotate] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          className,
          !priority && !loaded ? "opacity-0" : "opacity-100"
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
