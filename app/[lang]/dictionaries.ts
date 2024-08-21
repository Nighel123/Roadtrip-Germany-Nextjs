import "server-only";

const dictionaries = {
  en: () =>
    import("../../dictionaries/en.json").then((module) => module.default),
  de: () =>
    import("../../dictionaries/de.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "de") =>
  dictionaries[locale]();

export type Dict = Awaited<ReturnType<typeof getDictionary>>;