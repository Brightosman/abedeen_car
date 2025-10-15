// components/ui/LightSweepBadge.tsx
"use client";

import * as React from "react";

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** seconds for one full sweep (default: 6) */
  speedSec?: number;
  /** inner ring thickness in px (default: 2) */
  ring?: number;
  /** arc size in degrees (default: 60) */
  arcDeg?: number;
  /** highlight color (CSS value). Default: elegant gold */
  color?: string;
};

export default function LightSweepBadge({
  children,
  icon,
  speedSec = 6,
  ring = 2,
  arcDeg = 60,
  color = "hsl(45 90% 55%)" // gold
}: Props) {
  const arc = Math.max(10, Math.min(180, arcDeg));
  const haloExtra = 4; // how far the outer halo extends

  return (
    <div className="relative inline-flex items-center">
      {/* Content */}
      <div className="relative z-0 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
        {icon ? <span className="inline-flex h-3.5 w-3.5 items-center justify-center">{icon}</span> : null}
        {children}
      </div>

      {/* --- LIGHT SWEEP (masked to the border) --- */}
      <span
        className="pointer-events-none absolute inset-0 z-10 rounded-full"
        style={{
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ring}px), #000 calc(100% - ${ring}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${ring}px), #000 calc(100% - ${ring}px))`
        }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              ${color} 0deg,
              ${color} ${arc}deg,
              transparent ${arc + 1}deg,
              transparent 360deg
            )`,
            animation: `sweep ${speedSec}s linear infinite`,
            filter: "blur(0.4px)"
          }}
        />
      </span>

      {/* --- OUTER HALO (soft glow outside the border following the arc) --- */}
      <span
        className="pointer-events-none absolute -inset-[2px] z-10 rounded-full"
        style={{
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ring + haloExtra}px), #000 calc(100% - ${ring + haloExtra}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${ring + haloExtra}px), #000 calc(100% - ${ring + haloExtra}px))`
        }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              ${withAlpha(color, 0.35)} 0deg,
              ${withAlpha(color, 0.35)} ${arc}deg,
              transparent ${arc + 1}deg,
              transparent 360deg
            )`,
            animation: `sweep ${speedSec}s linear infinite`,
            filter: "blur(4px)"
          }}
        />
      </span>

      {/* Local keyframes */}
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

/** Turns "hsl(...)" or any CSS color into rgba with given alpha via CSS trick */
function withAlpha(color: string, a: number) {
  // For simplicity we assume a normal CSS color; browsers will handle it.
  // Use color-mix to blend with transparent for wider compatibility.
  const pct = Math.round(a * 100);
  return `color-mix(in oklab, ${color} ${pct}%, transparent)`;
}
