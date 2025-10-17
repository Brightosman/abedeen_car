// i18n/request.ts  ← REPLACE
import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({locale}) => {
  const activeLocale = locale ?? "fr";

  // Debug log to your terminal so we can see what file is being imported
  console.log("[next-intl] activeLocale =", activeLocale);

  const Home = (await import(`../messages/${activeLocale}/Home.json`)).default;
  const Marketplace = (await import(`../messages/${activeLocale}/Marketplace.json`).catch(() => ({default: {}}))).default;
  const Listing     = (await import(`../messages/${activeLocale}/Listing.json`).catch(() => ({default: {}}))).default;
  
  return {locale: activeLocale, messages: {Home, Marketplace, Listing}};
});
