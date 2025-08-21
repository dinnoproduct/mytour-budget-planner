import { useRecoilState } from 'recoil';
import { selectedPackageAtom } from '../store/store';
import { type PackageEntity } from '@entities/package';

export const useSelectedPackage = () => {
  const [selectedPackage, setSelectedPackage] = useRecoilState(selectedPackageAtom);

  const storeSelectedPackage = (packageData: PackageEntity) => {
    setSelectedPackage(packageData);
  };

  const clearSelectedPackage = () => {
    setSelectedPackage(null);
  };

  return {
    selectedPackage,
    storeSelectedPackage,
    clearSelectedPackage
  };
};
