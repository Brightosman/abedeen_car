// app/[locale]/layout.tsx  ← DROP-IN REPLACE
import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCart",
  description: "Find your next car with confidence",
  alternates: {languages: {en: "/en", fr: "/fr"}},
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // In Next 15, layouts receive params as a Promise in RSC
  params: Promise<{ locale: string }>;
}) {
  const {locale: raw} = await params;
  const locale = raw === "en" || raw === "fr" ? raw : "fr";

  // URL-driven i18n: load messages by segment
  const Home = (await import(`../../messages/${locale}/Home.json`)).default;
  const Marketplace = (await import(`../../messages/${locale}/Marketplace.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={{Home, Marketplace}}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
