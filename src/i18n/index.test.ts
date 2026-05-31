import { describe, expect, it } from "vitest";

import en from "./en.json";
import ru from "./ru.json";
import uk from "./uk.json";
import { detectLocale, translate } from "./index";

describe("i18n foundation", () => {
  it("detects supported browser locales", () => {
    expect(detectLocale("en-US")).toBe("en");
    expect(detectLocale("ru-RU")).toBe("ru");
    expect(detectLocale("uk-UA")).toBe("uk");
  });

  it("falls back to English for unsupported locales", () => {
    expect(detectLocale("de-DE")).toBe("en");
  });

  it("reads placeholder translations from the skeleton resources", () => {
    expect(translate("en", "app.status.foundationReady")).toBe("Repository foundation is ready.");
  });

  it("keeps translation keys in parity across supported locales", () => {
    const englishKeys = Object.keys(en).sort();

    expect(Object.keys(ru).sort()).toEqual(englishKeys);
    expect(Object.keys(uk).sort()).toEqual(englishKeys);
  });
});
