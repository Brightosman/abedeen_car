// app/[locale]/page.tsx  ← REPLACE
import HomePage from "@/components/home/HomePage";
import {notFound} from "next/navigation";

export const dynamic = "force-dynamic"; // always render fresh in dev
export const revalidate = 0;

type Params = {locale: string};

export default async function Page({
  params
}: {
  // In Next.js 15, params in Server Components must be awaited
  params: Promise<Params>;
}) {
  const {locale} = await params;
  if (!["en", "fr"].includes(locale)) notFound();
  return <HomePage />;
}


