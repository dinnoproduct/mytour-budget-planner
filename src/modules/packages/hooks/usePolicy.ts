import { langKeyAdapter } from '../../../utils/normalizers.ts';
import type { PackagesFields } from '../data/packagesEnums.ts';
import type { PackageEntity, GroupTourName } from '@entities/package';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectedPackage } from './useSelectedPackage.ts';

const usePolicy = (packageOverride?: PackageEntity | null) => {
  const { i18n } = useTranslation();
  const { selectedPackage } = useSelectedPackage();
  const packageData = packageOverride ?? selectedPackage;

  const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter;
  const bookingPolicy = `bookingPolicy${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.bookingPolicyArm;
  const cancelationPolicy =
    `cancelationPolicy${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.cancelationPolicyArm;

  // Group tours: travelAgencyPolicy has bookingPolicy/cancelationPolicy with Arm/Eng/Rus suffix
  const groupTourBookingRaw = (packageData as any)?.travelAgencyPolicy?.[bookingPolicy] as string | undefined;
  const groupTourCancelationRaw = (packageData as any)?.travelAgencyPolicy?.[cancelationPolicy] as string | undefined;

  const parsedPolicy = useMemo(() => {
    // Use package/hotel field first, then fall back to group tour field
    const rawSource = packageData?.[bookingPolicy] ?? groupTourBookingRaw;
    if (!rawSource) {
      return { before: '', after: '', urlText: '', url: '' };
    }

    try {
      const parsedBookingPolicy = JSON.parse(rawSource);

      if (!parsedBookingPolicy?.policy) {
        return { before: '', after: '', urlText: '', url: '' };
      }

      const { policy } = parsedBookingPolicy;
      const pattern = /%@(.*?)%@/;
      const match = pattern.exec(policy as string);

      if (!match) {
        return { before: policy, after: '', urlText: '', url: parsedBookingPolicy.url || '' };
      }

      const [before, urlText, after] = [
        policy.substring(0, match.index),
        match[1], // The URL text (what user sees)
        policy.substring(match.index + match[0].length),
      ];

      return { 
        before, 
        urlText, 
        after, 
        url: parsedBookingPolicy.url || urlText || '' // Use url from JSON, fallback to urlText, or empty
      };
    } catch (error) {
      console.error('Error parsing booking policy:', error);
      return { before: '', after: '', urlText: '', url: '' };
    }
  }, [packageData?.[bookingPolicy], groupTourBookingRaw, bookingPolicy]);

  // Package/hotel field first, then group tour field
  const cancelationPolicyContent = packageData?.[cancelationPolicy] ?? groupTourCancelationRaw ?? '';

  return { parsedPolicy, cancelationPolicy, cancelationPolicyContent };
};

export default usePolicy;
