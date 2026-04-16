import PackagesPagination from '../components/PackagesPagination/PackagesPagination'
import PackageList from '../components/PackageList/PackageList'
import Filters from '../components/Filters/Filters'
import PackagesHeader from '../components/PackagesHeader/PackagesHeader'
import PackageSlider from '../components/PackageSlider/PackageSlider'
import NoResult from '../components/NoResult/NoResult'
import usePackages from '../hooks/usePackages'
import { Loader } from '@/components/Loader/Loader'
import { useQueryParams } from '../../../hooks/useQueryParams'
import BookAfterPaymentModal from '../components/BookAfterPaymentModal/BookAfterPaymentModal'
import { useEffect } from 'react'
import { useLanguageNavigate } from '../../../hooks/useLanguageNavigate'

const Packages = () => {
	const { navigateToHome } = useLanguageNavigate()
	const { filteredPackages, loading } = usePackages()

	const { searchParams } = useQueryParams()

	const showPackageSlider = !(
		searchParams.search ||
		searchParams.cities ||
		(searchParams.page && searchParams.page !== '1')
	)

	useEffect(() => {
		navigateToHome()
	}, [navigateToHome])

	return (
		<div>
			<BookAfterPaymentModal/>
			<Loader loading={loading}/>
			<PackagesHeader/>
			<Filters/>{' '}
			{filteredPackages.length ? (
				<>
					{showPackageSlider ? <PackageSlider/> : null}
					<PackageList/>
					<PackagesPagination/>
				</>
			) : (
				<NoResult/>
			)}
		</div>
	)
}

export default Packages
