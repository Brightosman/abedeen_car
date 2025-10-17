// components/general/Footer.tsx
"use client";

import {useTranslations} from "next-intl";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

function Container({children}: {children: React.ReactNode}) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export default function Footer() {
  const t = useTranslations("Home");

  return (
    <footer className="border-t py-10 text-sm">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="text-xl font-extrabold">
              Auto<span className="text-primary">Mart</span>
            </div>
            <p className="mt-2 max-w-xs text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          <div>
            <p className="font-semibold">{t("footer.marketplace.title")}</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>{t("footer.marketplace.browse")}</li>
              <li>{t("footer.marketplace.sell")}</li>
              <li>{t("footer.marketplace.pricing")}</li>
              <li>{t("footer.marketplace.dealers")}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">{t("footer.company.title")}</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>{t("footer.company.about")}</li>
              <li>{t("footer.company.careers")}</li>
              <li>{t("footer.company.blog")}</li>
              <li>{t("footer.company.support")}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">{t("footer.loop.title")}</p>
            <div className="mt-3 flex max-w-sm items-center gap-2">
              <Input placeholder={t("footer.loop.email")} type="email" />
              <Button>{t("footer.loop.subscribe")}</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("footer.loop.terms")}</p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AutoMart.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#">{t("footer.legal.terms")}</a>
            <a href="#">{t("footer.legal.privacy")}</a>
            <a href="#">{t("footer.legal.cookies")}</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
