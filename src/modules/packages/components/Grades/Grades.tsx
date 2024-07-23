import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store.ts';
import { PackagesFields } from '../../data/packagesEnums.ts';
import './index.scss';

const Grades = () => {
  const { t } = useTranslation();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  return (
    <div className="flight-wrapper">
      <div className="grades-details-title flex space-between">
        <div className="font-bold">{t('grades')}</div>
        <div className="booking">{t('bookingGrade')}</div>
      </div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('travelersGrades')}</div>
        <div className="details-info-value">
          {packageDetails[PackagesFields.hotel]?.[PackagesFields.travellersRating]}
        </div>
      </div>
      <div className="detail-info-item last flex space-between">
        <div className="details-info-name">{t('cleanliness')}</div>
        <div className="details-info-value">{packageDetails[PackagesFields.hotel]?.[PackagesFields.cleanliness]}</div>
      </div>
    </div>
  );
};

export default Grades;
