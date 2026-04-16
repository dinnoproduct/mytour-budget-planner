import type { ReactNode } from "react";
import { I18nInit } from "@/components/I18nInit/I18nInit";

const SUPPORTED_LOCALES = ["hy", "en", "ru"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hy";

  return (
    <>
      <I18nInit locale={locale} />
      {children}
    </>
  );
}
