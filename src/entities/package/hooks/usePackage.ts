import { usePackageGeneric } from "./usePackageGeneric";

export const usePackage = () => {
  return usePackageGeneric({ packageType: 'regular' });
};
