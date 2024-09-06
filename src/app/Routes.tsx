import { Outlet, Route, Routes as BaseRoutes } from 'react-router-dom'
import PackagesRoutes from '../modules/packages/routes/PackagesRoutes'
import useBreakpoint from '../hooks/useBreakpoint'
import { HomePage } from '../pages/HomePage.tsx'
import { PackageListPage } from '@pages/PackageListPage'

const Routes = () => {
	useBreakpoint()

	return (
		<BaseRoutes>
			<Route element={<Outlet/>}>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/packages" element={<PackageListPage/>}/>
				<Route path="/*" element={<PackagesRoutes/>}/>
			</Route>
		</BaseRoutes>
	)
}

export default Routes
