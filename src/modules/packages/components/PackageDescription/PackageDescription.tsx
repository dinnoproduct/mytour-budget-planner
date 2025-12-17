import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import useDictionaryByKey from '../../hooks/useDictionaryByKey.ts';
import { PackagesFields } from '../../data/packagesEnums.ts';
import { DictionaryTypes } from '../../data/dictionaryEnum.ts';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store.ts';
import useDictionary from '../../hooks/useDictionary.ts';
import './index.scss';

const PackageDescription: FC = () => {
  const { t } = useTranslation();

  // const [packageTravelDetails, setPackageTravelDetails] = useRecoilState(packageTravelDetailsAtom);
  const packageDetails = useRecoilValue(packageDetailsAtom);

  useDictionary(DictionaryTypes.FoodTypeDictionary);

  const foodType = useDictionaryByKey(packageDetails[PackagesFields.foodType], DictionaryTypes.FoodTypeDictionary);

  return (
    <div className="includes-wrapper">
      <div className="details-title font-bold">{t('whatIncludesInPackage')}</div>
      <div className="packaga-includes no-border">
        <div className="includes-info flex">
          <div className="inner flex">
            <img src="/images/hotel.svg" alt="" />
            <span>{t('hotel')}</span>
          </div>
          <div className="inner flex">
            <img src="/images/all-inclusive.svg" alt="" />
            <span>{foodType}</span>
          </div>
        </div>
        <div className="includes-info flex">
          <div className="inner flex">
            <img src="/images/ticket.svg" alt="" />
            <span>{t('airTicket')}</span>
          </div>
          <div className="inner flex">
            <img src="/images/transfer.svg" alt="" />
            <span>{t('transfer')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDescription;
