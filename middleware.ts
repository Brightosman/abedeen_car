// middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import createMiddleware from "next-intl/middleware";
import {routing} from "./i18n/routing";

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  // Fix cross-locale like /fr/en or /en/fr → keep the second segment
  const cross = pathname.match(/^\/(en|fr)\/(en|fr)(\/.*)?$/);
  if (cross && cross[1] !== cross[2]) {
    const target = `/${cross[2]}${cross[3] ?? ""}`;
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Fix duplicate same-locale like /en/en → /en
  const dup = pathname.match(/^\/(en|fr)\/\1(\/.*)?$/);
  if (dup) {
    const target = `/${dup[1]}${dup[2] ?? ""}`;
    return NextResponse.redirect(new URL(target, req.url));
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"]
};
