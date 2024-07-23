import { useRecoilState } from 'recoil';
import { filteredPackagesAtom, packageDetailsAtom, packagesAtom } from '../store/store.ts';
import { type IPackage, type TPackages } from '../data/packagesTypes.ts';
import { useEffect, useState } from 'react';
import { getPackageService, getPackagesService } from '../services/PackagesServices.ts';

interface IUsePackages {
  packages: TPackages;
  filteredPackages: TPackages;
  packageDetails: IPackage;
  loading: boolean;
}

const usePackages = (id?: number): IUsePackages => {
  const [packages, setPackages] = useRecoilState(packagesAtom);
  const [filteredPackages, setFilteredPackages] = useRecoilState(filteredPackagesAtom);
  const [packageDetails, setPackageDetails] = useRecoilState(packageDetailsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(true);
      void getPackagesService()
        .then(({ data }) => {
          setPackages(data);
          setFilteredPackages(data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      void getPackageService(id)
        .then(({ data }) => {
          setPackageDetails(data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // useEffect(() => {
  //   if (id) {
  //     setPackageDetails(packages.find((item) => item[PackagesFields.offerId] === id) ?? ({} as IPackage));
  //   }
  // }, [id, packages]);

  return { packages, packageDetails, filteredPackages, loading };
};

export default usePackages;
