import { LanguageName } from '@shared/model';

const LANGUAGE_PATH_PREFIXES: LanguageName[] = ['en', 'ru'];
const LANGUAGE_CODE_REGEX = /^[a-z]{2}$/i;

const getSegments = (pathname: string): string[] =>
  pathname.split('/').filter(Boolean);

const getFirstSegment = (pathname: string): string | undefined =>
  getSegments(pathname)[0];

const isSupportedLanguagePrefix = (segment?: string): segment is LanguageName =>
  !!segment && LANGUAGE_PATH_PREFIXES.includes(segment as LanguageName);

const isLanguageLikePrefix = (segment?: string): boolean =>
  !!segment && LANGUAGE_CODE_REGEX.test(segment);

const shouldStripFirstSegment = (segment?: string): boolean =>
  isSupportedLanguagePrefix(segment) ||
  (isLanguageLikePrefix(segment) && !isSupportedLanguagePrefix(segment));

export const hasUnsupportedLanguagePrefix = (pathname: string): boolean => {
  const firstSegment = getFirstSegment(pathname);
  return isLanguageLikePrefix(firstSegment) && !isSupportedLanguagePrefix(firstSegment);
};

export const getLanguageFromPath = (pathname: string): LanguageName => {
  const firstSegment = getFirstSegment(pathname);

  if (isSupportedLanguagePrefix(firstSegment)) {
    return firstSegment;
  }

  return 'hy';
};

export const getPathWithoutLanguage = (pathname: string): string => {
  const segments = getSegments(pathname);
  const firstSegment = segments[0];

  if (shouldStripFirstSegment(firstSegment)) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }

  return pathname || '/';
};

export const getPathWithLanguage = (path: string, language: LanguageName): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (language === 'hy') {
    return cleanPath;
  }

  return `/${language}${cleanPath}`;
};

export const isValidLanguageRoute = (pathname: string): boolean => {
  return !hasUnsupportedLanguagePrefix(pathname);
};

export const getLanguagePrefix = (language: LanguageName): string => {
  return language === 'hy' ? '' : `/${language}`;
};

export const getUrlWithLanguage = (pathname: string, search: string, language: LanguageName): string => {
  const pathWithoutLanguage = getPathWithoutLanguage(pathname);
  const pathWithLanguage = getPathWithLanguage(pathWithoutLanguage, language);
  return search ? `${pathWithLanguage}${search}` : pathWithLanguage;
};
