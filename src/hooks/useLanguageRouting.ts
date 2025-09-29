import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { getLanguageFromPath, getPathWithoutLanguage, getPathWithLanguage, getUrlWithLanguage } from '../utils/languageRoutes';
import { LanguageName } from '@shared/model';

export const useLanguageRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Get current language from URL
  const currentLanguage = getLanguageFromPath(location.pathname);

  // Change language and update URL
  const changeLanguage = useCallback(async (newLanguage: LanguageName) => {
    // Get new URL with language prefix and preserved query parameters
    const newUrl = getUrlWithLanguage(location.pathname, location.search, newLanguage);
    
    // Update i18n language
    await i18n.changeLanguage(newLanguage);
    
    // Navigate to new path with query parameters
    navigate(newUrl, { replace: true });
  }, [i18n, location.pathname, location.search, navigate]);

  // Sync language with localStorage and URL
  useEffect(() => {
    const storedLanguage = localStorage.getItem('lng') as LanguageName;
    
    if (storedLanguage !== currentLanguage) {
      // If stored language differs from URL, update URL
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ru' || storedLanguage === 'hy')) {
        // Get new URL with language prefix and preserved query parameters
        const newUrl = getUrlWithLanguage(location.pathname, location.search, storedLanguage);
        navigate(newUrl, { replace: true });
      } else {
        // If no stored language, set current URL language to localStorage
        localStorage.setItem('lng', currentLanguage);
        i18n.changeLanguage(currentLanguage);
      }
    } else {
      // Sync i18n with current language
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n, location.pathname, location.search, navigate]);

  return {
    currentLanguage,
    changeLanguage,
    getPathWithLanguage: (path: string) => getPathWithLanguage(path, currentLanguage),
    getPathWithoutLanguage: () => getPathWithoutLanguage(location.pathname),
  };
};
