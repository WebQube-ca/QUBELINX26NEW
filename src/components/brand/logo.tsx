"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };
  const icon = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 tracking-tight text-foreground",
        sizes[size],
        className
      )}
    >
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm shadow-teal-600/30",
          icon[size]
        )}
        aria-hidden
      >
        <span className="absolute inset-[22%] rounded-[3px] border border-white/80" />
        <span className="absolute h-[18%] w-[55%] rounded-full bg-white/90" />
      </span>
      <span className="font-[family-name:var(--font-sora)]">
        <span className="font-bold">Qube</span>
        <span className="font-medium text-foreground/80">Linx</span>
      </span>
    </Link>
  );
}
