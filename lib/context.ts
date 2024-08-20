import { Dict } from "app/[lang]/dictionaries";
import serverContext from "server-only-context";

export const [getLang, setLang] = serverContext<"en" | "de">("en");
/* export const [getContext, setContext] = serverContext<Dict | null>(
  await getContext("en")
); */
