// components/general/Header.tsx
"use client";

import {useTranslations} from "next-intl";
import {Link} from "@/i18n/routing";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {useTheme} from "next-themes";
import {Sun, Moon} from "lucide-react";
import {Button} from "@/components/ui/button";

function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function Container({children}: {children: React.ReactNode}) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export default function Header() {
  const t = useTranslations("Home");

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/" className="text-lg font-extrabold">
            Auto<span className="text-primary">Mart</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link className="hidden text-sm text-muted-foreground md:inline" href="/marketplace">
              {t("nav.browse")}
            </Link>
            <Link className="hidden text-sm text-muted-foreground md:inline" href="/sell">
              {t("nav.sell")}
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}

