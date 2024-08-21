import type { NextAuthConfig } from "next-auth";
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

export const authConfig = {
  pages: {
    signIn: "/login",
    //newUser: "/", // does not work
  },
  callbacks: {
    authorized({ auth, request }) {
      // Check if there is any supported locale in the pathname
      const { pathname } = request.nextUrl;
      //console.log(auth);
      const forbiddenURL = ["/insertRoadtrip", "/chat", "/dashboard"];
      if (forbiddenURL.some((path) => pathname.endsWith(path))) return !!auth;
      const pathnameHasLocale = locales.some(
        (locale) =>
          pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
      );

      //if (request.nextUrl.pathname.endsWith("Overview.jpg"))
      //console.log(request.nextUrl);
      if (pathnameHasLocale) return true;

      // Redirect if there is no locale
      const locale = getLocale(request);

      request.nextUrl.pathname = `/${locale}${pathname}`;
      // e.g. incoming request is /products
      // The new URL is now /en-US/products

      return NextResponse.redirect(request.nextUrl);
    } /* ,
    async redirect({ url, baseUrl }) {
      console.log("url: ", url, "baseUrl: ", baseUrl);
      return url;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "user: ",
        user,
        "account: ",
        account,
        "profile: ",
        profile,
        "email: ",
        email,
        "credentials: ",
        credentials
      );
      return true;
    }, */,
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  providers: [], // Add providers with an empty array for now
  //debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;
