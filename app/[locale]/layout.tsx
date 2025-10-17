// app/[locale]/layout.tsx  ← REPLACE ENTIRE FILE
import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCart",
  description: "Find your next car with confidence",
  alternates: {languages: {en: "/en", fr: "/fr"}}
};

type Params = {locale: "en" | "fr"};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const {locale} = await params;

  // Load messages explicitly (Home + Marketplace strings are enough for header/footer)
  const Home = (await import(`../../messages/${locale}/Home.json`)).default;
  const Marketplace = (await import(`../../messages/${locale}/Marketplace.json`).catch(() => ({default: {}}))).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={{Home, Marketplace}}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
