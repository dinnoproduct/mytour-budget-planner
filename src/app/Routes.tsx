import {
  Outlet,
  Route,
  Routes as BaseRoutes,
  useNavigate
} from 'react-router-dom'
import PackagesRoutes from '../modules/packages/routes/PackagesRoutes'
import useBreakpoint from '../hooks/useBreakpoint'
import { HomePage } from '@pages/HomePage'
import { PackageListPage } from '@pages/PackageListPage'
import { PackageDetailsPage } from '@pages/PackageDetailsPage'
import { useScrollToTop } from '@shared/hooks'
import { MyPackagesPage } from '@pages/MyPackagesPage.tsx'
import {
  HotelPackagesSearchProvider,
  PackagesSearchProvider
} from '@entities/package'
import { useUserContext } from '@entities/user'
import { useEffect } from 'react'
import { HotelPackageDetailsPage } from '@pages/HotelPackageDetailsPage.tsx'
import { BlogsPage } from '@pages/BlogsPage.tsx'

const Routes = () => {
  useBreakpoint()
  useScrollToTop()

  return (
    <BaseRoutes>
      <Route element={<Outlet />}>
        <Route
          element={
            // todo: create component for all search providers
            <PackagesSearchProvider>
              <HotelPackagesSearchProvider>
                <Outlet />
              </HotelPackagesSearchProvider>
            </PackagesSearchProvider>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackageListPage />} />
          <Route path="/package" element={<PackageDetailsPage />} />
          <Route path="/hotel" element={<HotelPackageDetailsPage />} />
        </Route>

        <Route path="/blogs" element={<BlogsPage />} />

        <Route
          path="/my-packages"
          element={
            <AuthorizedRoute>
              <MyPackagesPage />
            </AuthorizedRoute>
          }
        />

        <Route path="/*" element={<PackagesRoutes />} />
      </Route>
    </BaseRoutes>
  )
}

export default Routes

const AuthorizedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/')
    }
  }, [user, isLoading, navigate])

  return user ? children : null
}
