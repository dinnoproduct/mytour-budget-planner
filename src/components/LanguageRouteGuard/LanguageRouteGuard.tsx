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
  const { navigate } = useLanguageNavigate();

  useEffect(() => {
    if (!hasUnsupportedLanguagePrefix(pathname)) {
      return;
    }

    const sanitizedPath = getPathWithoutLanguage(pathname);
    const nextLocation = `${sanitizedPath}${search ?? ''}${hash ?? ''}`;

    navigate(nextLocation || '/', { replace: true });
  }, [hash, navigate, pathname, search]);

  return <>{children}</>;
};
