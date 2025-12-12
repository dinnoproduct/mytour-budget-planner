/**
 * UTM Parameters Management
 * 
 * Extracts UTM parameters from URL on initial page load and stores them
 * in sessionStorage for the duration of the session. This allows tracking
 * marketing campaign attribution across page navigations without polluting URLs.
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const STORAGE_KEY = 'utm_params';

/**
 * Extracts UTM parameters from the current URL
 */
export const extractUTMParamsFromURL = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  const utmKeys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
  ];

  utmKeys.forEach((key) => {
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
 * Initializes UTM parameter tracking
 * Should be called once on app initialization
 */
export const initializeUTMTracking = (): void => {
  // Extract and store UTM params from initial page load
  storeUTMParams();
};

