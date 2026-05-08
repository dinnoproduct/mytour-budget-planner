"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import {
  getLanguageFromPath,
  getPathWithoutLanguage,
  getPathWithLanguage,
  getUrlWithLanguage,
} from "../utils/languageRoutes";
import type { LanguageName } from "@shared/model";

export const useLanguageRouting = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();

  const normalizeLanguage = (language?: string): LanguageName => {
    if (!language) return "hy";
    const base = language.split("-")[0]?.toLowerCase();
    if (base === "en" || base === "ru" || base === "hy") {
      return base as LanguageName;
    }
    return "hy";
  };

  const hasLanguagePrefix =
    pathname.startsWith("/en") || pathname.startsWith("/ru");

  const currentLanguage = hasLanguagePrefix
    ? getLanguageFromPath(pathname)
    : normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  const changeLanguage = useCallback(
    async (newLanguage: LanguageName) => {
      const search = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
      const newUrl = getUrlWithLanguage(pathname, search, newLanguage);
      await i18n.changeLanguage(newLanguage);
      router.replace(newUrl);
    },
    [i18n, pathname, searchParams, router]
  );

  useEffect(() => {
    const syncLanguage = async () => {
      if (i18n.language !== currentLanguage) {
        await i18n.changeLanguage(currentLanguage);
      }
    };
    void syncLanguage();
  }, [currentLanguage, i18n]);

  return {
    currentLanguage,
    changeLanguage,
    getPathWithLanguage: (path: string) =>
      getPathWithLanguage(path, currentLanguage),
    getPathWithoutLanguage: () => getPathWithoutLanguage(pathname),
  };
};
