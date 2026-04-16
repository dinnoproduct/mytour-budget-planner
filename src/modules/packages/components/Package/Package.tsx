import { type IPackage } from '../../data/packagesTypes';
import { useTranslation } from 'react-i18next';
import { PackagesFields, PackagesNestedFields } from '../../data/packagesEnums';
import { langKeyAdapter, numberWithCommaNormalizer } from '../../../../utils/normalizers';
import ImageSlider from '../../../../components/ImageSlider/ImageSlider';

const Package = ({ tourPackage }: { tourPackage: IPackage }) => {
  const { i18n, t } = useTranslation();
  const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter;
  const name = `name${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.nameArm;

  return (
    <div className="p-b-24">
      <ImageSlider images={tourPackage[PackagesFields.hotel][PackagesFields.images]} />
      <div>{tourPackage[name]}</div>
      <div>
        <span>{tourPackage[PackagesFields.city][PackagesNestedFields.country][name]}</span>,
        <span>{tourPackage[PackagesFields.city][name]}</span>
      </div>
      <div>
        <span>
          {t('adult')} {tourPackage[PackagesFields.adultTravelers]}{' '}
        </span>
        <span>
          {t('child')} {tourPackage[PackagesFields.childrenTravelers]}
        </span>
        <span>
          {' '}
          | {t('night')} {tourPackage[PackagesFields.nights]}
        </span>
      </div>
      <div>
        <span>{t('packageIncludes')}</span>
        <span>icon {t('hotel')}</span>
        <span>icon {t('airTicket')}</span>
        <span>icon {t('allInclusiveFood')}</span>
        <span>icon {t('transfer')}</span>
      </div>
      <div>
        {t('priceFrom')} {numberWithCommaNormalizer(tourPackage[PackagesFields.price])} ֏<div>{t('viewMore')}</div>
      </div>
    </div>
  );
};

export default Package;
