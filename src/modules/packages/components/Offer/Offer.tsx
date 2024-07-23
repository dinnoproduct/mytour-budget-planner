import './index.scss';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { langKeyAdapter, numberWithCommaNormalizer } from '../../../../utils/normalizers.ts';
import { PackagesFields, PackagesNestedFields } from '../../data/packagesEnums.ts';
import ImageSlider from '../../../../components/ImageSlider/ImageSlider.tsx';
import { type IPackage } from '../../data/packagesTypes.ts';
import { Link } from 'react-router-dom';
import useDictionaryByKey from '../../hooks/useDictionaryByKey.ts';
import { DictionaryTypes } from '../../data/dictionaryEnum.ts';

interface OfferProps {
  isBest?: boolean;
  tourPackage: IPackage;
  handleCardClick?: (event: any, tourPackage: IPackage) => void;
}

const Offer: FC<OfferProps> = ({ isBest, tourPackage, handleCardClick }) => {
  const { i18n, t } = useTranslation();
  const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter;
  const name = `name${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.nameArm;

  const foodType = useDictionaryByKey(tourPackage[PackagesFields.foodType], DictionaryTypes.FoodTypeDictionary);

  return (
    <div className="best-offer-wrapper cursor">
      <ImageSlider images={tourPackage[PackagesFields.hotel][PackagesFields.images]} isPackageList />
      <div onClickCapture={(event) => handleCardClick?.(event, tourPackage)}>
        <div className="info flex space-between">
          <div className="offer-title font-bold">{tourPackage[name]}</div>
          <div>
            <div className="stars flex space-between">
              <img src="/images/star.svg" alt="" /> {tourPackage[PackagesFields.hotel][PackagesFields.stars]}
            </div>
          </div>
        </div>
        <div className="subtitle">
          {tourPackage[PackagesFields.city][PackagesNestedFields.country][name]},{' '}
          {tourPackage[PackagesFields.city][name]}
        </div>
        <div className="subtitle">
          {tourPackage[PackagesFields.adultTravelers]} {t('adult')}{' '}
          {tourPackage[PackagesFields.childrenTravelers]
            ? `, ${tourPackage[PackagesFields.childrenTravelers]} ${t('child')}`
            : null}
          | {tourPackage[PackagesFields.nights]} {t('night')}
        </div>
        <div className="divider"></div>
        {!isBest && (
          <div className="packaga-includes">
            <div className="packaga-includes-title">{t('packageIncludes')}</div>
            <div className="includes-info flex">
              <div className="inner flex">
                <img src="/images/hotel.svg" alt="" />
                <span>{t('hotel')}</span>
              </div>
              <div className="inner flex">
                <img src="/images/ticket.svg" alt="" />
                <span>{t('airTicket')}</span>
              </div>
            </div>
            <div className="includes-info flex">
              <div className="inner flex">
                <img src="/images/all-inclusive.svg" alt="" />
                <span>{foodType}</span>
              </div>
              <div className="inner flex">
                <img src="/images/transfer.svg" alt="" />
                <span>{t('transfer')}</span>
              </div>
            </div>
          </div>
        )}
        <div className="price-wrapper">
          <div className="price-title">{t('priceFrom')}</div>
          <div className="flex space-between">
            <div className="price">
              <div className="flex prices">
                <div className="price-new font-bold">
                  {numberWithCommaNormalizer(tourPackage[PackagesFields.price])}֏
                </div>
                {/*<div className="price-old font-bold">1,280,000֏</div>*/}
              </div>
            </div>
            <Link to={`${tourPackage[PackagesFields.offerId]}`} className="see-more">
              <button>{t('viewMore')}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;
