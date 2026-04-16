"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@entities/user";
import { useLanguageRouting } from "@/hooks/useLanguageRouting";

interface Props {
  children: ReactNode;
}

export function AuthGuard({ children }: Props) {
  const { user, isLoading } = useUserContext();
  const router = useRouter();
  const { getPathWithLanguage } = useLanguageRouting();

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace(getPathWithLanguage("/"));
    }
  }, [user, isLoading, router, getPathWithLanguage]);

  if (isLoading) return null;
  return user ? <>{children}</> : null;
}
