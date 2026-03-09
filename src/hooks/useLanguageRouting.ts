import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { getLanguageFromPath, getPathWithoutLanguage, getPathWithLanguage, getUrlWithLanguage } from '../utils/languageRoutes';
import { LanguageName } from '@shared/model';
import { i18n } from '@shared/configs';

export const useLanguageRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current language from URL
  const currentLanguage = getLanguageFromPath(location.pathname);

  // Change language and update URL
  const changeLanguage = useCallback(async (newLanguage: LanguageName) => {
    const newUrl = getUrlWithLanguage(location.pathname, location.search, newLanguage);
    if (typeof i18n.changeLanguage === 'function') {
      await i18n.changeLanguage(newLanguage);
    }
    navigate(newUrl, { replace: true });
  }, [location.pathname, location.search, navigate]);

  // Sync language with URL only
  useEffect(() => {
    const syncLanguage = async () => {
      if (i18n.language !== currentLanguage && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(currentLanguage);
      }
    };

    void syncLanguage();
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    getPathWithLanguage: (path: string) => getPathWithLanguage(path, currentLanguage),
    getPathWithoutLanguage: () => getPathWithoutLanguage(location.pathname),
  };
};
