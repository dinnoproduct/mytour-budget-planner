import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationHY from "../locales/hy.json";
import translationEN from "../locales/en.json";
import translationRU from "../locales/ru.json";
import faqHY from "../locales/faq-hy.json";
import faqEN from "../locales/faq-en.json";
import faqRU from "../locales/faq-ru.json";
import termsHY from "../locales/terms-hy.json";
import termsEN from "../locales/terms-en.json";
import termsRU from "../locales/terms-ru.json";

const resources = {
  hy: {
    translation: {
      ...translationHY,
      ...faqHY,
      ...termsHY,
    },
  },
  en: {
    translation: {
      ...translationEN,
      ...faqEN,
      ...termsEN,
    },
  },
  ru: {
    translation: {
      ...translationRU,
      ...faqRU,
      ...termsRU,
    },
  },
};

const languages = Object.keys(resources);

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: "pathDetector",
  lookup() {
    if (typeof window === "undefined") return undefined;
    const pathname = window.location.pathname;
    if (pathname.startsWith("/en/") || pathname === "/en") return "en";
    if (pathname.startsWith("/ru/") || pathname === "/ru") return "ru";
    return "hy";
  },
});

void i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    detection: {
      order: ["pathDetector"],
      caches: [],
    },
    supportedLngs: languages,
    fallbackLng: languages,
    keySeparator: false,
    nsSeparator: "|",
    resources,
    debug: false,
    interpolation: {
      escapeValue: false,
      format: (value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value as string;
      },
    },
  });

export { i18n };
export default i18n;
