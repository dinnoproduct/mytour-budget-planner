"use client";

import { usePathname, useSearchParams } from "next/navigation";

/**
 * react-router-dom `useLocation` compat for next/navigation.
 * Returns { pathname, search, hash, state, key } — same shape as react-router.
 */
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.size > 0 ? `?${searchParams.toString()}` : "";

  return {
    pathname,
    search,
    hash: "",
    state: null as unknown,
    key: "default",
  };
}
