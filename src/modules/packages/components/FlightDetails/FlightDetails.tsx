import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store.ts';
import { PackagesFields } from '../../data/packagesEnums.ts';
import useDictionary from '../../hooks/useDictionary.ts';
import { DictionaryTypes } from '../../data/dictionaryEnum.ts';
import useDictionaryByKey from '../../hooks/useDictionaryByKey.ts';
import { dateFormatter, formatDateAndTime } from '../../../../utils/normalizers.ts';
import './index.scss';

const FlightDetails = () => {
  const { t } = useTranslation();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  useDictionary(DictionaryTypes.TicketClassDictionary);

  const ticketClass = useDictionaryByKey(
    packageDetails[PackagesFields.destinationFlight]?.[PackagesFields.ticketClass],
    DictionaryTypes.TicketClassDictionary,
  );

  return (
    <div className="flight-wrapper">
      <div className="flights-details-title font-bold">{t('flightDetails')}</div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('airCompany')}</div>
        <div className="details-info-value">
          {packageDetails[PackagesFields.destinationFlight]?.[PackagesFields.airCompany]?.[PackagesFields.name]}
        </div>
      </div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('class')}</div>
        <div className="details-info-value">{ticketClass}</div>
      </div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('departure')}</div>
        <div className="details-info-value">
          {dateFormatter(packageDetails[PackagesFields.destinationFlight]?.[PackagesFields.departureDate])},{' '}
          {formatDateAndTime(packageDetails[PackagesFields.destinationFlight]?.[PackagesFields.departureDate], {
            onlyTime: true,
          })}
        </div>
      </div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('return')}</div>
        <div className="details-info-value">
          {dateFormatter(packageDetails[PackagesFields.returnFlight]?.[PackagesFields.departureDate])},{' '}
          {formatDateAndTime(packageDetails[PackagesFields.returnFlight]?.[PackagesFields.departureDate], {
            onlyTime: true,
          })}
        </div>
      </div>
      <div className="detail-info-item flex space-between">
        <div className="details-info-name">{t('smallBaggage')}</div>
        <div className="details-info-value">1 x 5կգ</div>
      </div>
      <div className="detail-info-item last flex space-between">
        <div className="details-info-name">{t('bigBaggage')}</div>
        <div className="details-info-value">1 x 20կգ</div>
      </div>
    </div>
  );
};

export default FlightDetails;
