// app/[locale]/layout.tsx  ← REPLACE ENTIRE FILE
import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCart",
  description: "Find your next car with confidence"
};

type Params = {locale: "en" | "fr"};

export default async function LocaleLayout({
  children,
  // In Next 15, params is a Promise in RSC
  params
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const {locale} = await params;

  // Load the messages explicitly from the URL segment
  const Home = (await import(`../../messages/${locale}/Home.json`)).default;
  const messages = {Home};

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
