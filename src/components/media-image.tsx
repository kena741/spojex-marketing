"use client";

import Image from "next/image";
import { useState } from "react";

const OPTIMIZED_HOSTS = new Set([
  "xfwgeoqlsutzelhccwyx.supabase.co",
  "images.unsplash.com",
]);

export function MediaImage({
  src,
  alt,
  className = "object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#e8b423_0%,transparent_32%),linear-gradient(160deg,#0a2463,#1238a0)]"
        aria-hidden
      />
    );
  }

  let optimized = false;
  try {
    optimized = OPTIMIZED_HOSTS.has(new URL(src).hostname);
  } catch {
    optimized = false;
  }

  if (!optimized) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
