import { Outlet, Route, Routes as BaseRoutes } from 'react-router-dom'
import PackagesRoutes from '../modules/packages/routes/PackagesRoutes'
import useBreakpoint from '../hooks/useBreakpoint'
import { HomePage } from '../pages/HomePage.tsx'
import { PackageListPage } from '@pages/PackageListPage'
import { PackageDetailsPage } from '@pages/PackageDetailsPage'
import { useScrollToTop } from '@shared/hooks'

const Routes = () => {
	useBreakpoint()
	useScrollToTop()

	return (
		<BaseRoutes>
			<Route element={<Outlet/>}>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/packages" element={<PackageListPage/>}/>
				<Route path="/package" element={<PackageDetailsPage/>}/>
				<Route path="/*" element={<PackagesRoutes/>}/>
			</Route>
		</BaseRoutes>
	)
}

export default Routes
