import NextAuth, { Session } from "next-auth";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";
let locales = ["de", "en"];

export function getLocale(headers: Headers) {
  let acc_lang_headers = {
    "accept-language": headers.get("accept-language") || "",
  };
  let languages = new Negotiator({ headers: acc_lang_headers }).languages();

  let defaultLocale = "en";

  return match(languages, locales, defaultLocale) as "en" | "de";
}

export default NextAuth(authConfig).auth;

/* function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname

  const { pathname } = request.nextUrl;

  const cookieStore = cookies();
  const cookieLang = cookieStore.get("NEXT_LOCALE")?.value;
  const lang = cookieLang ?? getLocale(request.headers);

  let pathnameHasLocale: boolean = pathname.startsWith(`/${lang}`);

  if (pathnameHasLocale) {
    let response = NextResponse.next();
    response.headers.set("x-current-roadtrip-path", pathname);
    return response;
  }

  const regex = /(de|en)\b/;
  let newPath: string;
  if (regex.test(pathname)) {
    newPath = pathname.replace(regex, `${lang}`);
  } else {
    newPath = `/${lang}${pathname}`;
  }

  request.nextUrl.pathname = newPath;
  // Redirect if there is no locale

  // e.g. incoming request is /products
  // The new URL is now /en-US/products

  return NextResponse.redirect(request.nextUrl);
} */

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|images).*)"],
  // what does the regex do?: https://rubular.com/r/aS10Q8RWoeBg54
};
/*   matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ], */
