import { Outlet, Route, Routes as BaseRoutes } from 'react-router-dom'
import PackagesRoutes from '../modules/packages/routes/PackagesRoutes.tsx'
import useBreakpoint from '../hooks/useBreakpoint.ts'
import { HomePage } from '../pages/HomePage.tsx'
import { Footer } from '@ui'

const Routes = () => {
	useBreakpoint()

	return (
		<BaseRoutes>
			<Route
				element={
					<>
						<Outlet/>
						<Footer/>
					</>
				}
			>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/*" element={<PackagesRoutes/>}/>
			</Route>
		</BaseRoutes>
	)
}

export default Routes
