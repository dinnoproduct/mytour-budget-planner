"use client";

const NAVIGATION_STATE_PREFIX = "__navigation_state__:";

const getStorageKey = (path: string) => `${NAVIGATION_STATE_PREFIX}${path}`;

export const persistNavigationState = (path: string, state: unknown) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(getStorageKey(path), JSON.stringify(state));
  } catch {
    // Ignore storage errors and fall back to null state.
  }
};

export const readNavigationState = (path: string) => {
  if (typeof window === "undefined") return null;

  try {
    const rawState = sessionStorage.getItem(getStorageKey(path));
    return rawState ? JSON.parse(rawState) : null;
  } catch {
    return null;
  }
};
