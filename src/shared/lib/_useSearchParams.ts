"use client";

import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

type SearchParamsInit =
  | URLSearchParams
  | Record<string, string>
  | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>);

function toURLSearchParams(
  value: URLSearchParams | Record<string, string>
): URLSearchParams {
  if (value instanceof URLSearchParams) return value;
  return new URLSearchParams(value as Record<string, string>);
}

/**
 * react-router-dom `useSearchParams` compat for next/navigation.
 * Returns [URLSearchParams, setSearchParams] — same tuple as react-router v6.
 * setSearchParams accepts URLSearchParams, plain objects, or updater functions.
 */
export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const nextSearchParams = useNextSearchParams();

  function setSearchParams(
    nextInit: SearchParamsInit,
    options?: { replace?: boolean }
  ) {
    const current = new URLSearchParams(nextSearchParams.toString());
    const resolved =
      typeof nextInit === "function" ? nextInit(current) : nextInit;
    const next = toURLSearchParams(resolved);
    const search = next.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    if (options?.replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  }

  return [nextSearchParams, setSearchParams] as const;
}
