import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppPaths } from '../../../constants/constants'
import PackageDetails from '../containers/PackageDetails'
import { useEffect } from 'react'
import Packages from '@/modules/packages/containers/Packages'
import { useLanguageRouting } from '../../../hooks/useLanguageRouting'

const PackagesRoutes = () => {
	const { pathname } = useLocation()
	const { getPathWithLanguage } = useLanguageRouting()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return (
		<Routes>
			<Route index element={<Navigate to={getPathWithLanguage('/')} replace/>}/>
			<Route path={AppPaths.packages}>
				<Route index element={<Packages/>}/>
				<Route path=":id" element={<PackageDetails/>}/>
			</Route>
			<Route path="*" element={<Navigate to={getPathWithLanguage('/')} replace/>}/>
		</Routes>
	)
}

export default PackagesRoutes
