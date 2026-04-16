import { describe, expect, it } from "vitest";

import {
  getLanguageFromPath,
  getLanguagePrefix,
  getPathWithLanguage,
  getPathWithoutLanguage,
  getUrlWithLanguage,
  hasUnsupportedLanguagePrefix,
  isValidLanguageRoute,
} from "./languageRoutes";

describe("languageRoutes", () => {
  describe("hasUnsupportedLanguagePrefix", () => {
    it("returns true for unsupported two-letter prefix", () => {
      expect(hasUnsupportedLanguagePrefix("/fr/tours")).toBe(true);
    });

    it("returns false for supported prefix and non-language first segment", () => {
      expect(hasUnsupportedLanguagePrefix("/en/tours")).toBe(false);
      expect(hasUnsupportedLanguagePrefix("/tour/france")).toBe(false);
    });

    it("treats uppercase language-like prefixes as unsupported", () => {
      expect(hasUnsupportedLanguagePrefix("/EN/about")).toBe(true);
      expect(hasUnsupportedLanguagePrefix("/FR/about")).toBe(true);
    });
  });

  describe("getLanguageFromPath", () => {
    it("returns route language when supported prefix exists", () => {
      expect(getLanguageFromPath("/ru/about")).toBe("ru");
    });

    it("falls back to hy when no supported prefix exists", () => {
      expect(getLanguageFromPath("/about")).toBe("hy");
      expect(getLanguageFromPath("/fr/about")).toBe("hy");
      expect(getLanguageFromPath("/")).toBe("hy");
      expect(getLanguageFromPath("")).toBe("hy");
    });
  });

  describe("getPathWithoutLanguage", () => {
    it("strips supported language prefix and keeps remaining path", () => {
      expect(getPathWithoutLanguage("/en/tours/list")).toBe("/tours/list");
    });

    it("strips unsupported two-letter prefix similarly to supported locales", () => {
      expect(getPathWithoutLanguage("/fr/tours")).toBe("/tours");
      expect(getPathWithoutLanguage("/de")).toBe("/");
    });

    it("returns original path when first segment is not language-like", () => {
      expect(getPathWithoutLanguage("/tour/france")).toBe("/tour/france");
    });

    it("returns root for empty and root-like paths", () => {
      expect(getPathWithoutLanguage("/")).toBe("/");
      expect(getPathWithoutLanguage("")).toBe("/");
    });
  });

  describe("getPathWithLanguage and getLanguagePrefix", () => {
    it("keeps default locale unprefixed", () => {
      expect(getPathWithLanguage("tours", "hy")).toBe("/tours");
      expect(getLanguagePrefix("hy")).toBe("");
    });

    it("adds prefix for non-default locales", () => {
      expect(getPathWithLanguage("/tours", "en")).toBe("/en/tours");
      expect(getPathWithLanguage("tours", "ru")).toBe("/ru/tours");
      expect(getPathWithLanguage("/", "en")).toBe("/en/");
      expect(getLanguagePrefix("ru")).toBe("/ru");
    });
  });

  describe("getUrlWithLanguage and isValidLanguageRoute", () => {
    it("builds URL with language and preserves query string", () => {
      expect(getUrlWithLanguage("/ru/tours", "?page=2", "en")).toBe(
        "/en/tours?page=2",
      );
    });

    it("builds URL without query when search is empty", () => {
      expect(getUrlWithLanguage("/en/tours", "", "hy")).toBe("/tours");
    });

    it("marks routes invalid only for unsupported language-like prefixes", () => {
      expect(isValidLanguageRoute("/fr/tours")).toBe(false);
      expect(isValidLanguageRoute("/en/tours")).toBe(true);
      expect(isValidLanguageRoute("/tour/france")).toBe(true);
      expect(isValidLanguageRoute("/")).toBe(true);
    });
  });
});
