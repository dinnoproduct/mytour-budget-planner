import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppPaths } from '../../../constants/constants.ts'
import PackageDetails from '../containers/PackageDetails.tsx'
import { useEffect } from 'react'
import Packages from '@/modules/packages/containers/Packages.tsx'

const PackagesRoutes = () => {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return (
		<Routes>
			<Route index element={<Navigate to="/"/>}/>
			<Route path={AppPaths.packages}>
				<Route index element={<Packages/>}/>
				<Route path=":id" element={<PackageDetails/>}/>
			</Route>
			<Route path="*" element={<Navigate to="/"/>}/>
		</Routes>
	)
}

export default PackagesRoutes
