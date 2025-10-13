// app/page.tsx
import {redirect, routing} from "@/i18n/routing";

export default function Index() {
  redirect({href: "/", locale: routing.defaultLocale}); // "/" -> "/fr"
}
