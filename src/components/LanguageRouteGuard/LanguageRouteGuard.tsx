import { useEffect } from 'react';
import { useLanguageNavigate } from '../../hooks/useLanguageNavigate';
import { useLocation } from 'react-router-dom';
import { getPathWithoutLanguage, hasUnsupportedLanguagePrefix } from '../../utils/languageRoutes';

interface LanguageRouteGuardProps {
  children: React.ReactNode;
}

export const LanguageRouteGuard = ({ children }: LanguageRouteGuardProps) => {
  const location = useLocation();
  const { pathname, search, hash } = location;
  const { navigateTo } = useLanguageNavigate();

  useEffect(() => {
    if (!hasUnsupportedLanguagePrefix(pathname)) {
      return;
    }

    const sanitizedPath = getPathWithoutLanguage(pathname);
    const nextLocation = `${sanitizedPath}${search ?? ''}${hash ?? ''}`;

    navigateTo(nextLocation || '/', { replace: true });
  }, [hash, navigateTo, pathname, search]);

  return <>{children}</>;
};
