import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { getLanguageFromPath, getPathWithoutLanguage, getPathWithLanguage, getUrlWithLanguage } from '../utils/languageRoutes';
import { LanguageName } from '@shared/model';

export const useLanguageRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const normalizeLanguage = (language?: string): LanguageName => {
    if (!language) return 'hy';
    const baseLanguage = language.split('-')[0]?.toLowerCase();
    if (baseLanguage === 'en' || baseLanguage === 'ru' || baseLanguage === 'hy') {
      return baseLanguage as LanguageName;
    }
    return 'hy';
  };

  // Prefer explicit URL language; fallback to current i18n language when URL has no prefix.
  const languageFromPath = getLanguageFromPath(location.pathname);
  const hasLanguagePrefix = location.pathname.startsWith('/en') || location.pathname.startsWith('/ru');
  const currentLanguage = hasLanguagePrefix
    ? languageFromPath
    : normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  // Change language and update URL
  const changeLanguage = useCallback(async (newLanguage: LanguageName) => {
    // Get new URL with language prefix and preserved query parameters
    const newUrl = getUrlWithLanguage(location.pathname, location.search, newLanguage);
    
    // Update i18n language
    await i18n.changeLanguage(newLanguage);
    
    // Navigate to new path with query parameters
    navigate(newUrl, { replace: true });
  }, [i18n, location.pathname, location.search, navigate]);

  // Sync language with URL only
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
    getPathWithLanguage: (path: string) => getPathWithLanguage(path, currentLanguage),
    getPathWithoutLanguage: () => getPathWithoutLanguage(location.pathname),
  };
};
