import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filteredPackagesAtom, packagesCurrentPageAtom, screenBreakpointAtom } from '../../store/store.ts';
import { paginateData } from '../../../../utils/methods.ts';
import Offer from '../Offer/Offer.tsx';
import Subscribe from '../Subscribe/Subscribe.tsx';
import { DictionaryTypes } from '../../data/dictionaryEnum.ts';
import useDictionary from '../../hooks/useDictionary.ts';
import { useQueryParams } from '../../../../hooks/useQueryParams.ts';
import { PackagesFields } from '../../data/packagesEnums.ts';
import { useNavigate } from 'react-router-dom';
import { type IPackage } from '../../data/packagesTypes.ts';

const PackageList = () => {
  const currentPage = useRecoilValue(packagesCurrentPageAtom);
  const filteredPackages = useRecoilValue(filteredPackagesAtom);
  const screenBreakpoint = useRecoilValue(screenBreakpointAtom);

  const navigate = useNavigate();

  useDictionary(DictionaryTypes.FoodTypeDictionary);

  const packages = useMemo(
    () => paginateData(filteredPackages, currentPage, screenBreakpoint === 'large' ? 9 : 8),
    [filteredPackages, currentPage],
  );

  const { searchParams } = useQueryParams();

  const showSubscribe = !(
    searchParams.search ||
    searchParams.cities ||
    (searchParams.page && searchParams.page !== '1')
  );

  const onOfferClick = (tourPackage: IPackage) => {
    navigate(`${tourPackage[PackagesFields.offerId]}`);
  };

  return (
    <div>
      <div className="container">
        <div className="offers offers-top flex">
          {packages.slice(0, screenBreakpoint === 'large' ? 6 : 4).map((tourPackage, index) => (
            <div className="offer-item inline-block" key={index}>
              <Offer
                tourPackage={tourPackage}
                key={tourPackage.offerId}
                handleCardClick={() => onOfferClick(tourPackage)}
              />
            </div>
          ))}
        </div>
        {showSubscribe ? <Subscribe /> : null}
        <div className="offers flex">
          {packages
            .slice(screenBreakpoint === 'large' ? 6 : 4, screenBreakpoint === 'large' ? 9 : 8)
            .map((tourPackage, index) => (
              <div className="offer-item inline-block" key={index}>
                <Offer
                  tourPackage={tourPackage}
                  key={tourPackage.offerId}
                  handleCardClick={() => onOfferClick(tourPackage)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PackageList;
