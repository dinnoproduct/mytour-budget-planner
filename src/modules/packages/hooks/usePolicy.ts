import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../store/store.ts';
import { langKeyAdapter } from '../../../utils/normalizers.ts';
import type { PackagesFields } from '../data/packagesEnums.ts';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const usePolicy = () => {
  const { i18n } = useTranslation();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter;
  const bookingPolicy = `bookingPolicy${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.bookingPolicyArm;
  const cancelationPolicy =
    `cancelationPolicy${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.cancelationPolicyArm;

  const parsedPolicy = useMemo(() => {
    const parsedBookingPolicy = JSON.parse(packageDetails[bookingPolicy] ? packageDetails[bookingPolicy] : '{}');

    if (!parsedBookingPolicy?.policy) {
      return { before: '', after: '', urlText: '' };
    }

    const { policy } = parsedBookingPolicy;
    const pattern = /%@(.*?)%@/;
    const match = pattern.exec(policy as string)!;

    const [before, urlText, after] = [
      policy.substring(0, match?.index),
      match?.[1], // The URL
      policy.substring(match?.index + match?.[0].length),
    ];

    return { before, urlText, after, url: parsedBookingPolicy.url };
  }, [packageDetails[bookingPolicy]]);

  return { parsedPolicy, cancelationPolicy };
};

export default usePolicy;
