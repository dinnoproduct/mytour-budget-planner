import { useRecoilValue } from "recoil";
import { selectedPackageAtom } from "../store/store";
import { useSearchPackage } from "@entities/package";

export const usePackageDetailsFromStore = () => {
  const selectedPackage = useRecoilValue(selectedPackageAtom);

  const {
    packageDetails: apiPackageDetails,
    isFetched,
    isLoading,
    childrenAges,
  } = useSearchPackage({}, !!selectedPackage);

  const packageDetails = selectedPackage ? selectedPackage : apiPackageDetails;

  return {
    packageDetails,
    isLoading,
    isUsingStoredData: !!selectedPackage,
    isFetched,
    childrenAges,
  };
};
