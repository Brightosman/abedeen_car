// app/[locale]/debug/page.tsx  ← NEW
import {getLocale, getMessages} from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <pre style={{padding:16}}>
      locale: {locale}
      {"\n"}Home.nav.browse: {(messages as any).Home?.nav?.browse}
    </pre>
  );
}
