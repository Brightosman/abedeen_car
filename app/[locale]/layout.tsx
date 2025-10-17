// app/[locale]/layout.tsx — DROP IN
import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages} from "next-intl/server";
import {ThemeProvider} from "@/components/theme-provider";
import TopBar from "@/components/general/TopBar";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCart",
  description: "Find your next car with confidence",
  alternates: {languages: {en: "/en", fr: "/fr"}}
};

export default async function LocaleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // next-intl resolves the locale from the [locale] segment + middleware
  const locale = await getLocale(); // "en" | "fr"
  const messages = await getMessages(); // includes all namespaces exported by i18n/request.ts

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TopBar phone={process.env.NEXT_PUBLIC_CONTACT_PHONE} />
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
