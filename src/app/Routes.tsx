import {
  Outlet,
  Route,
  Routes as BaseRoutes,
  useNavigate,
  Navigate
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
import { FAQPage } from '@pages/FAQPage/index.tsx'
import { TermsPage } from '@pages/TermsPage.tsx'
import { useLanguageRouting } from '../hooks/useLanguageRouting'
import { LanguageRouteGuard } from '../components/LanguageRouteGuard/LanguageRouteGuard'

const Routes = () => {
  useBreakpoint()
  useScrollToTop()

  return (
    <LanguageRouteGuard>
      <BaseRoutes>
        {/* Default language routes (Armenian) */}
        <Route path="/" element={<LanguageRouteWrapper />}>
          <Route
            element={
              <PackagesSearchProvider>
                <HotelPackagesSearchProvider>
                  <Outlet />
                </HotelPackagesSearchProvider>
              </PackagesSearchProvider>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="packages" element={<PackageListPage />} />
            <Route path="package" element={<PackageDetailsPage />} />
            <Route path="hotel" element={<HotelPackageDetailsPage />} />
          </Route>

          <Route path="blogs" element={<BlogsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="terms" element={<TermsPage />} />

          <Route
            path="my-packages"
            element={
              <AuthorizedRoute>
                <MyPackagesPage />
              </AuthorizedRoute>
            }
          />

          <Route path="*" element={<PackagesRoutes />} />
        </Route>

        {/* English routes */}
        <Route path="/en" element={<LanguageRouteWrapper />}>
          <Route
            element={
              <PackagesSearchProvider>
                <HotelPackagesSearchProvider>
                  <Outlet />
                </HotelPackagesSearchProvider>
              </PackagesSearchProvider>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="packages" element={<PackageListPage />} />
            <Route path="package" element={<PackageDetailsPage />} />
            <Route path="hotel" element={<HotelPackageDetailsPage />} />
          </Route>

          <Route path="blogs" element={<BlogsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="terms" element={<TermsPage />} />

          <Route
            path="my-packages"
            element={
              <AuthorizedRoute>
                <MyPackagesPage />
              </AuthorizedRoute>
            }
          />

          <Route path="*" element={<PackagesRoutes />} />
        </Route>

        {/* Russian routes */}
        <Route path="/ru" element={<LanguageRouteWrapper />}>
          <Route
            element={
              <PackagesSearchProvider>
                <HotelPackagesSearchProvider>
                  <Outlet />
                </HotelPackagesSearchProvider>
              </PackagesSearchProvider>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="packages" element={<PackageListPage />} />
            <Route path="package" element={<PackageDetailsPage />} />
            <Route path="hotel" element={<HotelPackageDetailsPage />} />
          </Route>

          <Route path="blogs" element={<BlogsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="terms" element={<TermsPage />} />

          <Route
            path="my-packages"
            element={
              <AuthorizedRoute>
                <MyPackagesPage />
              </AuthorizedRoute>
            }
          />

          <Route path="*" element={<PackagesRoutes />} />
        </Route>

      {/* Redirect old language routes */}
      <Route path="/arm" element={<Navigate to="/" replace />} />
      <Route path="/hy" element={<Navigate to="/" replace />} />
      <Route path="/eng" element={<Navigate to="/en" replace />} />
      <Route path="/rus" element={<Navigate to="/ru" replace />} />
      </BaseRoutes>
    </LanguageRouteGuard>
  )
}

export default Routes

const LanguageRouteWrapper = () => {
  const { currentLanguage } = useLanguageRouting()
  
  return <Outlet />
}

const AuthorizedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useUserContext()
  const { getPathWithLanguage } = useLanguageRouting()

  useEffect(() => {
    if (!user && !isLoading) {
      window.location.href = getPathWithLanguage('/')
    }
  }, [user, isLoading, getPathWithLanguage])

  return user ? children : null
}
