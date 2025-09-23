import { usePackageGeneric } from "./usePackageGeneric";

export const useHotelPackage = () => {
  return usePackageGeneric({ packageType: 'hotel' });
};
