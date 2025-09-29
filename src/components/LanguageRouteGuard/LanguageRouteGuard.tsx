import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLanguageFromPath, isValidLanguageRoute, SUPPORTED_LANGUAGES } from '../../utils/languageRoutes';
import { useLanguageNavigate } from '../../hooks/useLanguageNavigate';

interface LanguageRouteGuardProps {
  children: React.ReactNode;
}

export const LanguageRouteGuard = ({ children }: LanguageRouteGuardProps) => {
  const location = useLocation();
  const { navigateToHome } = useLanguageNavigate();

  useEffect(() => {
    const pathname = location.pathname;
    
    // Check if the current route has a valid language prefix
    if (!isValidLanguageRoute(pathname)) {
      // If no valid language prefix, redirect to default language
      const segments = pathname.split('/').filter(Boolean);
      const firstSegment = segments[0];
      
      // If first segment is not a language code, it's a default language route
      if (!SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
        // This is already a default language route, no redirect needed
        return;
      }
      
      // If it's an invalid language, redirect to default
      navigateToHome({ replace: true });
    }
  }, [location.pathname, navigateToHome]);

  return <>{children}</>;
};
