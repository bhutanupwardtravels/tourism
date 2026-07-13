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
          className,
          "transition-opacity duration-700",
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
