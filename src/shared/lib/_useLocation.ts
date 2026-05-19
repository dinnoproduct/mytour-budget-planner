"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { readNavigationState } from "./_navigationState";

/**
 * react-router-dom `useLocation` compat for next/navigation.
 * Returns { pathname, search, hash, state, key } — same shape as react-router.
 */
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams && searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  const state = readNavigationState(`${pathname}${search}`);

  return {
    pathname,
    search,
    hash: "",
    state,
    key: "default",
  };
}
