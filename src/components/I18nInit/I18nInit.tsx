"use client";

import { useEffect } from "react";
import { i18n } from "@shared/configs/i18next";

interface Props {
  locale: string;
}

export function I18nInit({ locale }: Props) {
  // Run synchronously on both server and client so the first render
  // always uses the correct locale and avoids hydration mismatches.
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  return null;
}
