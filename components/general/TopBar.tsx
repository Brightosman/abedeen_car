"use client";

import {useEffect, useState} from "react";
import {useLocale} from "next-intl";
import Link from "next/link";
import {X} from "lucide-react";

type Props = {
  /** Phone number to show. If not provided, reads NEXT_PUBLIC_CONTACT_PHONE. */
  phone?: string;
  className?: string;
};

export default function TopBar({phone, className}: Props) {
  const locale = useLocale();
  const [open, setOpen] = useState(true);
  const storageKey = `topbar:dismissed:${locale}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed === "1") setOpen(false);
  }, [storageKey]);

  function dismiss() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
    setOpen(false);
  }

  const tel =
    (phone || process.env.NEXT_PUBLIC_CONTACT_PHONE || "+33 1 23 45 67 89").trim();

  if (!open) return null;

  const label = locale === "fr" ? "Appelez-nous" : "Call us";
  const hours = locale === "fr" ? "9h–18h CET" : "9am–6pm CET";

  return (
    <div className={`w-full border-b bg-amber-400 text-black ${className ?? ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-black/70" />
          <span className="font-medium">{label}:</span>
          <Link
            href={`tel:${tel.replace(/\s+/g, "")}`}
            className="font-semibold underline decoration-dotted underline-offset-4"
          >
            {tel}
          </Link>
          <span className="opacity-75">• {hours}</span>
        </div>

        <button
          onClick={dismiss}
          aria-label={locale === "fr" ? "Fermer" : "Close"}
          className="rounded p-1 hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
