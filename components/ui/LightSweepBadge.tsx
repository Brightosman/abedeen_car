// components/ui/LightSweepBadge.tsx
"use client";

import * as React from "react";

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** seconds for one full sweep (default: 6) */
  speedSec?: number;
  /** ring thickness in px (default: 2) */
  ring?: number;
};

export default function LightSweepBadge({children, icon, speedSec = 6, ring = 2}: Props) {
  return (
    <div className="relative inline-flex">
      {/* The animated light ring (only the border animates) */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          // create a thin ring by masking the center out
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ring}px), #000 calc(100% - ${ring}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${ring}px), #000 calc(100% - ${ring}px))`,
        }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              // bright arc (~30deg) in your primary color, rest transparent
              "conic-gradient(from 0deg, hsl(var(--primary)) 0deg, transparent 30deg, transparent 330deg, hsl(var(--primary)) 360deg)",
            animation: `sweep ${speedSec}s linear infinite`,
            filter: "blur(0.5px)", // tiny softness
          }}
        />
      </span>

      {/* Actual badge content (static) */}
      <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
        {icon ? <span className="inline-flex h-3.5 w-3.5 items-center justify-center">{icon}</span> : null}
        {children}
      </div>

      {/* Local keyframes so you don't need Tailwind config */}
      <style jsx>{`
        @keyframes sweep {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
