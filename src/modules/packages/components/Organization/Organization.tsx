import './index.scss';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store';
import usePolicy from '../../hooks/usePolicy';

const Organization = () => {
  const { t } = useTranslation();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  const { parsedPolicy, cancelationPolicy } = usePolicy();

  return (
    <div className="organization-wrapper">
      <div className="organization-title font-bold">{t('company')}</div>
      <div className="organization-logo">
        <img src="/images/sky_tour_logo.svg" alt="" />
      </div>
      <div className="organization-title font-bold">{t('bookingAndPaymentRules')}</div>
      <div className="organization-text">
        {parsedPolicy.before}{' '}
        <a href={parsedPolicy.url} target="_blank" rel="noreferrer" className="policy-url">
          {parsedPolicy.urlText}
        </a>
        {parsedPolicy.after}
      </div>
      <div className="organization-title font-bold">{t('cancelRules')}</div>
      <div className="organization-text">{packageDetails[cancelationPolicy]}</div>
    </div>
  );
};

export default Organization;
