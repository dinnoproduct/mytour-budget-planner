import { useRecoilState } from 'recoil'
import { filteredPackagesAtom, packageDetailsAtom, packagesAtom } from '../store/store.ts'
import { type IPackage, type TPackages } from '../data/packagesTypes.ts'
import { useEffect, useState } from 'react'
import { getPackageService, getPackagesService } from '../services/PackagesServices.ts'
import { useSearchPackage } from '@entities/package'

interface IUsePackages {
	packages: TPackages;
	filteredPackages: TPackages;
	packageDetails: IPackage;
	loading: boolean;
}

const usePackages = (id?: number): IUsePackages => {
	const [packages] = useRecoilState(packagesAtom)
	const [filteredPackages] = useRecoilState(filteredPackagesAtom)
	const [packageDetails, setPackageDetails] = useRecoilState(packageDetailsAtom)
	const {packageDetails: packageD, isLoading} = useSearchPackage()

	useEffect(() => {
		if (!isLoading && packageD) {
			setPackageDetails(packageD as any)
		}
	}, [packageD?.id])

	// useEffect(() => {
	//   if (id) {
	//     setPackageDetails(packages.find((item) => item[PackagesFields.offerId] === id) ?? ({} as IPackage));
	//   }
	// }, [id, packages]);

	return { packages, packageDetails: packageD as any, filteredPackages, loading: isLoading }
}

export default usePackages
