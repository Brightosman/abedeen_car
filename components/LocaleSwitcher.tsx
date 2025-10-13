// components/LocaleSwitcher.tsx
"use client";

import {useLocale} from "next-intl";
import {usePathname, Link} from "@/i18n/routing";
import {Button} from "@/components/ui/button";

/**
 * Robust locale switcher:
 * - Detects & removes any leading /en or /fr from the current path
 * - Builds explicit absolute URLs ("/en" or "/fr" + path)
 * - Avoids "/en/en" and "/fr/fr" regardless of router behavior
 */
export default function LocaleSwitcher() {
  const current = useLocale();
  const rawPath = usePathname() || "/";

  // Strip a leading "/en" or "/fr" only at the start of the path
  // Examples:
  //   "/en"            -> ""
  //   "/en/market"     -> "/market"
  //   "/fr"            -> ""
  //   "/fr/cars/a3"    -> "/cars/a3"
  const pathNoLocale = rawPath.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";

  // Build explicit absolute URLs with the desired locale
  const hrefFR = `/fr${pathNoLocale === "/" ? "" : pathNoLocale}`;
  const hrefEN = `/en${pathNoLocale === "/" ? "" : pathNoLocale}`;

  return (
    <div className="inline-flex gap-2">
      <Button asChild size="sm" variant={current === "fr" ? "default" : "outline"}>
        <Link href={hrefFR} aria-label="Basculer en français">FR</Link>
      </Button>
      <Button asChild size="sm" variant={current === "en" ? "default" : "outline"}>
        <Link href={hrefEN} aria-label="Switch to English">EN</Link>
      </Button>
    </div>
  );
}
