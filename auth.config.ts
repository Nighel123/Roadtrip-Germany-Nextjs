import type { NextAuthConfig } from "next-auth";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

let locales = ["de", "en"];

export function getLocale(headers: Headers) {
  let acc_lang_headers = {
    "accept-language": headers.get("accept-language") || "",
  };
  let languages = new Negotiator({ headers: acc_lang_headers }).languages();

  let defaultLocale = "en";

  return match(languages, locales, defaultLocale) as "en" | "de";
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

      const cookieStore = cookies();
      const cookieLang = cookieStore.get("NEXT_LOCALE")?.value;
      const lang = cookieLang ?? getLocale(request.headers);

      let pathnameHasLocale: boolean = pathname.startsWith(`/${lang}`);

      //if (request.nextUrl.pathname.endsWith("Overview.jpg"))
      //console.log(request.nextUrl);
      if (pathnameHasLocale) {
        //console.log(auth);
        /* const forbiddenURL = ["insertRoadtrip", "chat", "dashboard"];
        if (
          forbiddenURL.some((path) => {
            const regex = new RegExp(`.*(${path}).*`, "gm");
            return regex.test(pathname);
          })
        )
          return NextResponse.next(); */
        const forbiddenURL = ["/insertRoadtrip", "/chat", "/dashboard"];
        if (forbiddenURL.some((path) => pathname.endsWith(path))) return !!auth;
        const headers = new Headers(request.headers);
        headers.set("x-current-path", pathname);
        return true;
      }

      const regex = /(de|en)\b/;
      let newPath: string;
      if (regex.test(pathname)) {
        newPath = pathname.replace(regex, `${lang}`);
      } else {
        newPath = `/${lang}/${pathname}`;
      }

      request.nextUrl.pathname = newPath;
      // Redirect if there is no locale

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
