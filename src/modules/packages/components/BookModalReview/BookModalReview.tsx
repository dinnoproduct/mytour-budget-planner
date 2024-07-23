import PreviewDetail from '../PreviewDetail/PreviewDetail.tsx';
import { useTranslation } from 'react-i18next';
import { type IBookForm } from '../../data/packagesTypes.ts';
import { type FC, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { packageDetailsAtom, preventSideModalCloseAtom } from '../../store/store.ts';
import {
  dateFormatter,
  formatDateAndTime,
  langKeyAdapter,
  numberWithCommaNormalizer,
} from '../../../../utils/normalizers.ts';
import { PackagesFields, PackagesNestedFields } from '../../data/packagesEnums.ts';
import { DictionaryTypes, TermsAndConditionTypes } from '../../data/dictionaryEnum.ts';
import useDictionaryByKey from '../../hooks/useDictionaryByKey.ts';
import { getDateMinusDays, overDaysFromNow } from '../../../../utils/methods.ts';
import TermsAndConditionsModal from '../TermsAndConditionsModal/TermsAndConditionsModal.tsx';

interface IBookModalReview {
  travelersInfo: IBookForm;
  amountToBePaid: string;
  onBack: () => void;
  onBook: () => void;
}

const BookModalReview: FC<IBookModalReview> = ({ travelersInfo, amountToBePaid, onBack, onBook }) => {
  const { t, i18n } = useTranslation();
  const [termsAndConditionType, setTermsAndConditionType] = useState<TermsAndConditionTypes | string>('');
  const setPreventSideModalClose = useSetRecoilState(preventSideModalCloseAtom);

  const packageDetails = useRecoilValue(packageDetailsAtom);

  const under21DaysFromNow = !overDaysFromNow(
    packageDetails[PackagesFields.destinationFlight][PackagesFields.departureDate],
    21,
  );

  const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter;
  const name = `name${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.nameArm;

  const foodType = useDictionaryByKey(packageDetails[PackagesFields.foodType], DictionaryTypes.FoodTypeDictionary);
  const roomType = useDictionaryByKey(packageDetails[PackagesFields.roomType], DictionaryTypes.RoomTypeDictionary);

  const balance = packageDetails[PackagesFields.price] - +amountToBePaid;

  useEffect(() => {
    setPreventSideModalClose(!!termsAndConditionType);
  }, [termsAndConditionType]);

  return (
    <div className="preview-wrapper">
      <TermsAndConditionsModal
        termsAndConditionType={termsAndConditionType as TermsAndConditionTypes}
        onClose={() => setTermsAndConditionType('')}
        title={
          (termsAndConditionType as TermsAndConditionTypes) === TermsAndConditionTypes.bookTerms
            ? t('bookingRules')
            : t('cancelRules')
        }
      />
      <div className="modal-back flex m-b-24 cursor" onClick={onBack}>
        <img className="m-r-8" src="/images/icon_back.svg" alt="" />
        <span>{t('back')}</span>
      </div>
      <div className="flex space-between">
        <div className="hotel-name font-bold">{packageDetails[name]}</div>
        <div>
          <div className="stars flex space-between">
            <img src="/images/star.svg" alt="" className="m-r-2" />{' '}
            {packageDetails[PackagesFields.hotel][PackagesFields.stars]}
          </div>
        </div>
      </div>
      <div className="hotel-place m-b-20">
        {packageDetails[PackagesFields.city][PackagesNestedFields.country][name]},
        {packageDetails[PackagesFields.city][name]}
      </div>
      <PreviewDetail name={t('price')} value={`${numberWithCommaNormalizer(packageDetails[PackagesFields.price])}֏`} />
      <PreviewDetail name={t('payedAmount')} value={`${numberWithCommaNormalizer(amountToBePaid)}֏`} last={!balance} />
      {balance ? (
        <PreviewDetail name={t('balance')} value={`${numberWithCommaNormalizer(balance)}֏`} last={under21DaysFromNow} />
      ) : null}
      {balance ? (
        <PreviewDetail
          name={t('nextPayment')}
          value={dateFormatter(
            getDateMinusDays(packageDetails[PackagesFields.destinationFlight][PackagesFields.departureDate], 15),
          )}
          last
        />
      ) : null}
      <div className="hotel-name font-bold m-t-4 inludes-title">{t('included')}</div>
      <div className="packaga-includes no-border width-360">
        <div className="includes-info flex">
          <div className="inner flex">
            <img className="m-r-8" src="/images/hotel.svg" alt="" />
            <span>{t('hotel')}</span>
          </div>
          <div className="inner flex">
            <img className="m-r-8" src="/images/all-inclusive.svg" alt="" />
            <span>{foodType}</span>
          </div>
        </div>
        <div className="includes-info flex">
          <div className="inner flex">
            <img className="m-r-8" src="/images/ticket.svg" alt="" />
            <span>{t('airTicket')}</span>
          </div>
          <div className="inner flex">
            <img className="m-r-8" src="/images/transfer.svg" alt="" />
            <span>{t('transfer')}</span>
          </div>
        </div>
      </div>
      <div className="hotel-name font-bold m-t-20 inludes-title">{t('travelers')}</div>
      {travelersInfo[PackagesFields.adults].map((adult, index, array) => (
        <PreviewDetail
          key={index}
          name={`${adult[PackagesFields.firstName]} ${adult[PackagesFields.lastName]}`}
          value={dateFormatter(adult[PackagesFields.birthDate]!)}
          last={!travelersInfo[PackagesFields.childs].length && index === array.length - 1}
        />
      ))}
      {travelersInfo[PackagesFields.childs].map((child, index, array) => (
        <PreviewDetail
          key={index}
          name={`${child[PackagesFields.firstName]} ${child[PackagesFields.lastName]}`}
          value={dateFormatter(child[PackagesFields.birthDate]!)}
          last={index === array.length - 1}
        />
      ))}
      <div className="hotel-name font-bold m-t-20 inludes-title">{t('flightDetails')}</div>

      <PreviewDetail
        name={t('departure')}
        value={`${dateFormatter(packageDetails[PackagesFields.destinationFlight]?.[PackagesFields.departureDate])},
        ${formatDateAndTime(packageDetails[PackagesFields.destinationFlight]?.[PackagesFields.departureDate], {
          onlyTime: true,
        })}`}
      />
      <PreviewDetail
        name={t('return')}
        value={`${dateFormatter(packageDetails[PackagesFields.returnFlight]?.[PackagesFields.departureDate])},
        ${formatDateAndTime(packageDetails[PackagesFields.returnFlight]?.[PackagesFields.departureDate], {
          onlyTime: true,
        })}`}
        last
      />
      <div className="hotel-name font-bold m-t-20 inludes-title">{t('hotelDetails')}</div>
      <PreviewDetail name={t('room')} value={roomType} />
      <PreviewDetail
        name={t('checkin')}
        value={`${dateFormatter(packageDetails[PackagesFields.checkin])},
        ${formatDateAndTime(packageDetails[PackagesFields.checkin], {
          onlyTime: true,
        })}`}
      />
      <PreviewDetail
        name={t('checkout')}
        value={`${dateFormatter(packageDetails[PackagesFields.checkout])},
        ${formatDateAndTime(packageDetails[PackagesFields.checkout], {
          onlyTime: true,
        })}`}
      />
      <PreviewDetail
        name={t('lateCheckout')}
        value={packageDetails[PackagesFields.lateCheckout] ? t('included') : t('notIncluded')}
        last
      />
      <div className="terms-and-descriptions p-b-6">
        {t('withContinueYouAccept')}{' '}
        <span className="terms-link pointer" onClick={() => setTermsAndConditionType(TermsAndConditionTypes.bookTerms)}>
          {t('bookingRules')}
        </span>{' '}
        {t('and')}{' '}
        <span
          className="terms-link pointer"
          onClick={() => setTermsAndConditionType(TermsAndConditionTypes.cancelTerms)}
        >
          {t('cancelRules')}
        </span>
        :
      </div>
      <div className="modal-footer">
        <button className="btn-main choose-room pay_preview" onClick={onBook}>
          {t('pay')}
        </button>
      </div>
    </div>
  );
};

export default BookModalReview;
