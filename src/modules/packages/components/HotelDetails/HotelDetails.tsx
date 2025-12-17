import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store.ts';
import { dateFormatter, formatDateAndTime } from '../../../../utils/normalizers.ts';
import { PackagesFields } from '../../data/packagesEnums.ts';
import './index.scss';

const HotelDetails = () => {
  const { t } = useTranslation();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  return (
    <div className="hotel-wrapper">
      <div className="hotel-details-title font-bold">{t('hotelDetails')}</div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('checkin')}</div>
        <div className="details-info-value">
          {dateFormatter(packageDetails[PackagesFields.checkin])},{' '}
          {formatDateAndTime(packageDetails[PackagesFields.checkin], {
            onlyTime: true,
          })}
        </div>
      </div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('checkout')}</div>
        <div className="details-info-value">
          {dateFormatter(packageDetails[PackagesFields.checkout])},{' '}
          {formatDateAndTime(packageDetails[PackagesFields.checkout], {
            onlyTime: true,
          })}
        </div>
      </div>
      <div className="detail-info-item last flex space-between">
        <div className="details-info-name">{t('lateCheckout')}</div>
        <div className="details-info-value">
          {packageDetails[PackagesFields.lateCheckout] ? t('included') : t('notIncluded')}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
