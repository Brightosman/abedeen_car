// components/ui/GlowBadge.tsx
"use client";

import {motion, useReducedMotion} from "framer-motion";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

/**
 * GlowBadge: animated conic-gradient ring around a pill.
 * - Respects prefers-reduced-motion
 * - Uses your Tailwind/shadcn color tokens (primary)
 */
export default function GlowBadge({children, icon, className}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`relative inline-flex rounded-full p-[2px] ${className ?? ""}`}
      style={{
        // The ring itself
        background:
          "conic-gradient(from 0deg, hsl(var(--primary)) 0deg, transparent 110deg, hsl(var(--primary)) 180deg, transparent 290deg, hsl(var(--primary)) 360deg)"
      }}
      animate={reduce ? undefined : {rotate: 360}}
      transition={reduce ? undefined : {duration: 8, ease: "linear", repeat: Infinity}}
    >
      <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
        {icon ? <span className="inline-flex h-3.5 w-3.5 items-center justify-center">{icon}</span> : null}
        {children}
      </div>

      {/* Subtle outer glow */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full blur"
          style={{background: "radial-gradient(closest-side, hsl(var(--primary)/.35), transparent)"}}
          animate={{opacity: [0.15, 0.35, 0.15]}}
          transition={{duration: 2.5, repeat: Infinity, ease: "easeInOut"}}
        />
      )}
    </motion.div>
  );
}
