"use client";

import { useRouter } from "next/navigation";
import { persistNavigationState } from "./_navigationState";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

/**
 * react-router-dom `useNavigate` compat for next/navigation.
 * Returns a function with the same signature:
 *   navigate(to: string | number, options?: NavigateOptions)
 */
export function useNavigate() {
  const router = useRouter();

  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      if (to === -1) {
        router.back();
      } else if (to === 1) {
        router.forward();
      }
      return;
    }

    if (options?.state !== undefined) {
      persistNavigationState(to, options.state);
    }

    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}
