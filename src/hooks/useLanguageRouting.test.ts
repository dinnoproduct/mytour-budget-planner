import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    pathname: "/",
    searchParams: new URLSearchParams(),
    replace: vi.fn(),
    i18n: {
      language: "hy",
      resolvedLanguage: "hy",
      changeLanguage: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock("react", () => ({
  useCallback: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  useEffect: (effect: () => void | Promise<void>) => {
    void effect();
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ replace: mocks.replace }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: mocks.i18n }),
}));

vi.mock("../utils/languageRoutes", () => ({
  getLanguageFromPath: vi.fn((pathname: string) => {
    if (pathname.startsWith("/en")) return "en";
    if (pathname.startsWith("/ru")) return "ru";
    return "hy";
  }),
  getPathWithoutLanguage: vi.fn((pathname: string) => pathname.replace(/^\/(en|ru)/, "") || "/"),
  getPathWithLanguage: vi.fn((path: string, language: string) =>
    language === "hy" ? path : `/${language}${path.startsWith("/") ? path : `/${path}`}`,
  ),
  getUrlWithLanguage: vi.fn((pathname: string, search: string, language: string) => {
    const basePath = pathname.replace(/^\/(en|ru)/, "") || "/";
    const localizedPath = language === "hy" ? basePath : `/${language}${basePath}`;
    return search ? `${localizedPath}${search}` : localizedPath;
  }),
}));

import { useLanguageRouting } from "./useLanguageRouting";
import {
  getLanguageFromPath,
  getPathWithLanguage,
  getPathWithoutLanguage,
  getUrlWithLanguage,
} from "../utils/languageRoutes";

describe("useLanguageRouting", () => {
  beforeEach(() => {
    mocks.pathname = "/";
    mocks.searchParams = new URLSearchParams();
    mocks.replace.mockReset();
    mocks.i18n.language = "hy";
    mocks.i18n.resolvedLanguage = "hy";
    mocks.i18n.changeLanguage = vi.fn().mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it("uses route prefix language when pathname contains supported locale", () => {
    mocks.pathname = "/en/tours";
    mocks.i18n.language = "hy";

    const result = useLanguageRouting();

    expect(getLanguageFromPath).toHaveBeenCalledWith("/en/tours");
    expect(result.currentLanguage).toBe("en");
  });

  it("falls back to normalized i18n locale when route has no locale prefix", () => {
    mocks.pathname = "/tours";
    mocks.i18n.language = "hy";
    mocks.i18n.resolvedLanguage = "RU-RU";

    const result = useLanguageRouting();

    expect(getLanguageFromPath).not.toHaveBeenCalled();
    expect(result.currentLanguage).toBe("ru");
  });

  it("falls back to hy for unsupported i18n locale values", () => {
    mocks.pathname = "/about";
    mocks.i18n.resolvedLanguage = "de-DE";
    mocks.i18n.language = "fr";

    const result = useLanguageRouting();

    expect(result.currentLanguage).toBe("hy");
  });

  it("syncs i18n language when derived language differs", async () => {
    mocks.pathname = "/ru/account";
    mocks.i18n.language = "hy";

    useLanguageRouting();
    await Promise.resolve();

    expect(mocks.i18n.changeLanguage).toHaveBeenCalledWith("ru");
  });

  it("does not re-sync i18n language when already aligned", async () => {
    mocks.pathname = "/en/pricing";
    mocks.i18n.language = "en";

    useLanguageRouting();
    await Promise.resolve();

    expect(mocks.i18n.changeLanguage).not.toHaveBeenCalled();
  });

  it("changeLanguage builds URL with search params and navigates", async () => {
    mocks.pathname = "/ru/tours";
    mocks.searchParams = new URLSearchParams("page=2&sort=asc");

    const result = useLanguageRouting();
    await result.changeLanguage("en");

    expect(getUrlWithLanguage).toHaveBeenCalledWith("/ru/tours", "?page=2&sort=asc", "en");
    expect(mocks.i18n.changeLanguage).toHaveBeenCalledWith("en");
    expect(mocks.replace).toHaveBeenCalledWith("/en/tours?page=2&sort=asc");
  });

  it("changeLanguage omits query marker when search params are empty", async () => {
    mocks.pathname = "/en/tours";
    mocks.searchParams = new URLSearchParams();

    const result = useLanguageRouting();
    await result.changeLanguage("hy");

    expect(getUrlWithLanguage).toHaveBeenCalledWith("/en/tours", "", "hy");
    expect(mocks.replace).toHaveBeenCalledWith("/tours");
  });

  it("returns path helpers bound to pathname and current language", () => {
    mocks.pathname = "/ru/checkout";

    const result = useLanguageRouting();

    result.getPathWithLanguage("/contact");
    result.getPathWithoutLanguage();

    expect(getPathWithLanguage).toHaveBeenCalledWith("/contact", "ru");
    expect(getPathWithoutLanguage).toHaveBeenCalledWith("/ru/checkout");
  });
});
