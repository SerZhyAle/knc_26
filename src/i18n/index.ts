import en from "./en.json";
import ru from "./ru.json";
import uk from "./uk.json";

export const supportedLocales = ["en", "ru", "uk"] as const;

export type Locale = (typeof supportedLocales)[number];
export type TranslationKey = keyof typeof en;

const resources: Record<Locale, Record<TranslationKey, string>> = {
  en,
  ru,
  uk
};

export function detectLocale(rawLanguage: string | undefined): Locale {
  const normalizedLanguage = rawLanguage?.toLowerCase() ?? "";

  if (normalizedLanguage.startsWith("ru")) {
    return "ru";
  }

  if (normalizedLanguage.startsWith("uk") || normalizedLanguage.startsWith("ua")) {
    return "uk";
  }

  return "en";
}

export function translate(locale: Locale, key: TranslationKey): string {
  return resources[locale][key];
}
