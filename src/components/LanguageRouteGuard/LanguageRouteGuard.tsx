"use client";

/**
 * LanguageRouteGuard — no-op in Next.js.
 * Unsupported language prefixes are handled at the proxy.ts (middleware) level.
 * Kept for backward compatibility with any remaining import sites.
 */

interface LanguageRouteGuardProps {
  children: React.ReactNode;
}

export const LanguageRouteGuard = ({ children }: LanguageRouteGuardProps) => {
  return <>{children}</>;
};
