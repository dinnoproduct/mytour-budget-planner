/**
 * UTM Parameters Management
 *
 * Extracts UTM parameters from URL on landing and stores them in sessionStorage
 * for the whole session. Enables correct conversion attribution to the original campaign.
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const STORAGE_KEY = 'utm_params';

export const UTM_KEYS: (keyof UTMParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

/**
 * Extracts UTM parameters from the current URL
 */
export const extractUTMParamsFromURL = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
};

/**
 * Stores UTM parameters in sessionStorage
 * Only stores if new UTM params are present in URL (first touch attribution)
 */
export const storeUTMParams = (): void => {
  // Check if we already have stored UTM params (first touch attribution)
  const existingParams = getStoredUTMParams();
  if (Object.keys(existingParams).length > 0) {
    // UTM params already stored, don't overwrite (maintain first touch)
    return;
  }

  const utmParams = extractUTMParamsFromURL();
  
  // Only store if we have at least one UTM parameter
  if (Object.keys(utmParams).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmParams));
    } catch (error) {
      console.warn('Failed to store UTM parameters:', error);
    }
  }
};

/**
 * Retrieves stored UTM parameters from sessionStorage
 */
export const getStoredUTMParams = (): UTMParams => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UTMParams;
    }
  } catch (error) {
    console.warn('Failed to retrieve UTM parameters:', error);
  }
  return {};
};

/**
 * Clears stored UTM parameters from sessionStorage
 */
export const clearUTMParams = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear UTM parameters:', error);
  }
};

/**
 * Gets UTM parameters for analytics logging
 * Returns stored params if available, otherwise extracts from current URL
 */
export const getUTMParams = (): UTMParams => {
  const stored = getStoredUTMParams();
  
  // If we have stored params, use them (first touch attribution)
  if (Object.keys(stored).length > 0) {
    return stored;
  }

  // Otherwise, check current URL (for cases where storage wasn't initialized)
  return extractUTMParamsFromURL();
};

/**
 * Checks if UTM parameters exist (either in storage or URL)
 */
export const hasUTMParams = (): boolean => {
  const params = getUTMParams();
  return Object.keys(params).length > 0;
};

/**
 * Appends stored UTM parameters to a URLSearchParams (mutates in place).
 * Use when building navigation URLs so UTMs persist for the session.
 */
export const appendStoredUTMsToSearchParams = (queryParams: URLSearchParams): void => {
  const stored = getStoredUTMParams();
  UTM_KEYS.forEach((key) => {
    const value = stored[key];
    if (value) {
      queryParams.set(key, value);
    }
  });
};

/**
 * Returns stored UTM params as a query string (e.g. "utm_source=google&utm_medium=cpc").
 * Empty string if none stored.
 */
export const getStoredUTMsAsQueryString = (): string => {
  const stored = getStoredUTMParams();
  const params = new URLSearchParams();
  UTM_KEYS.forEach((key) => {
    const value = stored[key];
    if (value) {
      params.set(key, value);
    }
  });
  return params.toString();
};

/**
 * Appends stored UTM parameters to a path (with or without existing query string).
 * Use for every client-side navigation so UTMs persist in the URL for the session.
 * Returns the same path if no UTMs are stored.
 */
export const appendStoredUTMsToPath = (path: string): string => {
  const utmQuery = getStoredUTMsAsQueryString();
  if (!utmQuery) return path;

  const [pathname, existingQuery] = path.split('?');
  const params = existingQuery ? new URLSearchParams(existingQuery) : new URLSearchParams();
  appendStoredUTMsToSearchParams(params);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * Initializes UTM parameter tracking.
 * Call on app init and on location change so we capture UTMs from the first URL that has them.
 */
export const initializeUTMTracking = (): void => {
  storeUTMParams();
};

/**
 * If the current URL has no UTM params but we have stored UTMs (e.g. after redirect
 * from payment gateway), restores them to the URL via replaceState so the address bar
 * and any URL-based tracking keep attribution. Call on route/location change.
 */
export const restoreStoredUTMsToUrl = (): void => {
  if (typeof window === 'undefined' || !window.history.replaceState) return;
  const currentSearch = new URLSearchParams(window.location.search);
  const hasUtmInUrl = UTM_KEYS.some((key) => currentSearch.has(key));
  if (hasUtmInUrl) return;

  const utmQuery = getStoredUTMsAsQueryString();
  if (!utmQuery) return;

  const params = new URLSearchParams(window.location.search);
  appendStoredUTMsToSearchParams(params);
  const newSearch = params.toString();
  const newUrl = newSearch
    ? `${window.location.pathname}?${newSearch}${window.location.hash ? window.location.hash : ''}`
    : `${window.location.pathname}${window.location.hash || ''}`;
  window.history.replaceState(null, '', newUrl);
};

