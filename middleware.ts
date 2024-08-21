import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

let locales = ["de", "en"];

function getLocale(request: NextRequest) {
  let headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  let languages = new Negotiator({ headers }).languages();

  let defaultLocale = "en";

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  //if (request.nextUrl.pathname.endsWith("Overview.jpg"))
  //console.log(request.nextUrl);
  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);

  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products

  return NextResponse.redirect(request.nextUrl);
}

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)",
  ],
  // what does the regex do?: https://rubular.com/r/aS10Q8RWoeBg54
};
