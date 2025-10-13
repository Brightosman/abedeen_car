import {NextIntlClientProvider, getTranslations, getMessages} from "next-intl/server";


export default async function MarketplaceLayout({children}: {children: React.ReactNode}) {
// You can keep using getMessages(); next-intl will tree‑shake by namespace
const messages = await getMessages();
return <>{children}</>;
}