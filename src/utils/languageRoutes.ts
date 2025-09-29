import { LanguageName } from '@shared/model';

export const SUPPORTED_LANGUAGES: LanguageName[] = ['hy', 'en', 'ru'];

export const getLanguageFromPath = (pathname: string): LanguageName => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment === 'en' || firstSegment === 'ru') {
    return firstSegment;
  }
  
  return 'hy';
};

export const getPathWithoutLanguage = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment === 'en' || firstSegment === 'ru') {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
};

export const getPathWithLanguage = (path: string, language: LanguageName): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (language === 'hy') {
    return cleanPath;
  }
  
  return `/${language}${cleanPath}`;
};

export const isValidLanguageRoute = (pathname: string): boolean => {
  const language = getLanguageFromPath(pathname);
  return SUPPORTED_LANGUAGES.includes(language);
};

export const getLanguagePrefix = (language: LanguageName): string => {
  return language === 'hy' ? '' : `/${language}`;
};

export const getUrlWithLanguage = (pathname: string, search: string, language: LanguageName): string => {
  const pathWithoutLanguage = getPathWithoutLanguage(pathname);
  const pathWithLanguage = getPathWithLanguage(pathWithoutLanguage, language);
  return search ? `${pathWithLanguage}${search}` : pathWithLanguage;
};
