// app/[locale]/marketplace/page.tsx
import {notFound} from "next/navigation";
import Marketplace from "@/components/marketplace/Marketplace";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {locale: string};

export default async function Page({
  params
}: {
  params: Promise<Params>;
}) {
  const {locale} = await params;
  if (!["en", "fr"].includes(locale)) notFound();
  return <Marketplace />;
}
