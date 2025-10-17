// app/[locale]/layout.tsx
import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider";
import Header from "@/components/general/Header";   // your chosen path
import Footer from "@/components/general/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCart",
  description: "Find your next car with confidence",
  alternates: {languages: {en: "/en", fr: "/fr"}}
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  // IMPORTANT: keep this as string (not union) to satisfy Next’s LayoutConfig constraint
  params: Promise<{ locale: string }>;
}) {
  const {locale: raw} = await params;
  // runtime guard + default
  const locale = raw === "en" || raw === "fr" ? raw : "fr";

  // Load the namespaces you need across the app
  const Home = (await import(`../../messages/${locale}/Home.json`)).default;
  const Marketplace = (await import(`../../messages/${locale}/Marketplace.json`).catch(() => ({default: {}}))).default;
  const Listing = (await import(`../../messages/${locale}/Listing.json`).catch(() => ({default: {}}))).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={{Home, Marketplace, Listing}}>
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
