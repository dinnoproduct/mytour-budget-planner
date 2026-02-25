import { useNavigate } from 'react-router-dom';
import { useLanguageRouting } from './useLanguageRouting';
import { appendStoredUTMsToPath } from '@/utils/utmParams';

export const useLanguageNavigate = () => {
  const navigate = useNavigate();
  const { getPathWithLanguage } = useLanguageRouting();

  const navigateTo = (path: string, options?: { replace?: boolean }) => {
    const languageAwarePath = getPathWithLanguage(path);
    const pathWithUtm = appendStoredUTMsToPath(languageAwarePath);
    navigate(pathWithUtm, options);
  };

  const navigateBack = (steps: number = 1) => {
    navigate(-steps);
  };

  const navigateToHome = (options?: { replace?: boolean }) => {
    navigateTo('/', options);
  };

  const navigateToPackages = (queryParams?: string, options?: { replace?: boolean }) => {
    const path = queryParams ? `/packages?${queryParams}` : '/packages';
    navigateTo(path, options);
  };

  const navigateToPackage = (packageId: string, options?: { replace?: boolean }) => {
    navigateTo(`/package/${packageId}`, options);
  };

  const navigateToHotel = (hotelId: string, options?: { replace?: boolean }) => {
    navigateTo(`/hotel/${hotelId}`, options);
  };

  const navigateToBlogs = (options?: { replace?: boolean }) => {
    navigateTo('/blogs', options);
  };

  const navigateToMyPackages = (
    options?: { queryParams?: string; replace?: boolean },
  ) => {
    const path = options?.queryParams
      ? `/my-packages?${options.queryParams}`
      : '/my-packages';
    navigateTo(path, { replace: options?.replace });
  };

  const navigateToBooking = (
    options?: { queryParams?: string; replace?: boolean },
  ) => {
    const path = options?.queryParams
      ? `/booking?${options.queryParams}`
      : '/booking';
    navigateTo(path, { replace: options?.replace });
  };

  const navigateToPayment = (options?: { state?: unknown; replace?: boolean }) => {
    const path = appendStoredUTMsToPath(getPathWithLanguage('/payment'));
    navigate(path, { state: options?.state, replace: options?.replace });
  };

  const BOOKING_RESULT_SOURCE_KEY = 'bookingResultSource'

  const navigateToBookingResult = (
    options?: {
      success?: boolean
      error?: boolean
      replace?: boolean
      /** When true, user came from payment flow (already booked/reserved) → show paymentSuccessModalText; else booking flow → bookingSuccessModalText */
      fromPayment?: boolean
    }
  ) => {
    if (options?.success) {
      try {
        localStorage.setItem(
          BOOKING_RESULT_SOURCE_KEY,
          options.fromPayment ? 'payment' : 'booking'
        )
      } catch {
        // ignore
      }
    }
    const params = new URLSearchParams()
    if (options?.success) {
      params.set('success', 'true')
    }
    if (options?.error) {
      params.set('error', 'true')
    }
    if (options?.fromPayment) {
      params.set('fromPayment', 'true')
    }
    const queryString = params.toString()
    const path = queryString ? `/booking-result?${queryString}` : '/booking-result'
    navigateTo(path, { replace: options?.replace })
  };

  return {
    navigateTo,
    navigateBack,
    navigateToHome,
    navigateToPackages,
    navigateToPackage,
    navigateToHotel,
    navigateToBlogs,
    navigateToMyPackages,
    navigateToBooking,
    navigateToPayment,
    navigateToBookingResult,
    // Keep original navigate for special cases
    navigate,
  };
};
