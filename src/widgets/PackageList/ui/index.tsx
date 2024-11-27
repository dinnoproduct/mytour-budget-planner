import { type LayoutProps } from './types'
import { Box, Container, Grid } from '@chakra-ui/react'
import {
  PackageCardSkeleton,
  type PackageEntity,
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import { PackageCard } from '@features/PackageCard'
import { EmptyState } from '@ui'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useQueryParams } from '@/hooks/useQueryParams.ts'

export const PackageList = () => {
  const { t } = useTranslation()
  const { searchParams } = useQueryParams()

  const activeTab = useMemo(() => {
    if (searchParams?.tab) {
      return searchParams.tab
    }

    return 'packages'
  }, [searchParams])

  const {
    filteredPackages,
    isLoadingFilteredPackages,
    searchData,
    isSearchError,
    isAllowedSearchRoute: isPackagesSearchView
  } = usePackagesSearchContext()

  const {
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isAllowedSearchRoute: isHotelSearchView
  } = useHotelPackagesSearchContext()

  const generateLink = (tourPackage: PackageEntity) => {
    const childrenTravelers =
      tourPackage.childrenTravelers + tourPackage.infantTravelers
    let pagePath = 'hotel'

    const queryParams: any = {
      city: tourPackage.city.id.toString(),
      adultsCount: tourPackage.adultTravelers.toString(),
      childrenCount: childrenTravelers.toString(),
      childrenAges: searchData.travelersData.childrenAges.join(','),
      hotelId: tourPackage.hotel.id.toString(),
      roomId: tourPackage.roomType.toString()
    }

    if (isPackagesSearchView) {
      queryParams.departureFlightId =
        tourPackage.destinationFlight.id.toString()
      queryParams.returnFlightId = tourPackage.returnFlight.id.toString()
      pagePath = 'package'
    } else {
      queryParams.from = tourPackage.checkin
      queryParams.to = tourPackage.checkout
    }

    const searchParams = new URLSearchParams(queryParams).toString()

    const url = `/${pagePath}?${searchParams}`

    return url
  }

  const activePackages = useMemo(
    () => (isHotelSearchView ? filteredHotelPackages : filteredPackages),
    [isHotelSearchView, filteredPackages, filteredHotelPackages]
  )

  const isLoadingPackages = useMemo(
    () =>
      isHotelSearchView
        ? isLoadingFilteredHotelPackages
        : isLoadingFilteredPackages,
    [
      isHotelSearchView,
      isLoadingFilteredPackages,
      isLoadingFilteredHotelPackages
    ]
  )

  // empty view
  if (!isLoadingPackages) {
    // if (isSearchError) {
    // 	return (
    // 		<EmptyState illustrationName="no-result" mt={{base: '160px', md: '200px'}}>
    // 			Տեխնիկական խնդիր, խնդրում ենք փորձել մի փոքր ուշ:
    // 		</EmptyState>
    // 	)
    // } else
    if (!activePackages?.length) {
      return (
        <EmptyState
          illustrationName="error"
          mt={{ base: '160px', md: '200px' }}
          text={t`packagesNotFoundText`}
        />
      )
    }
  }

  return (
    <Layout>
      {isLoadingPackages ? <SkeletonLoading /> : null}

      {!isLoadingPackages &&
        activePackages?.map(packageEntity => (
          <PackageCard
            tourPackage={packageEntity}
            key={packageEntity.offerId}
            link={generateLink(packageEntity)}
          />
        ))}
    </Layout>
  )
}

const SkeletonLoading = ({ carsCount = 8 }) =>
  Array(carsCount)
    .fill(1)
    .map((_data, index) => (
      <PackageCardSkeleton key={`package-card-skeleton-${1}`} />
    ))

const Layout = ({ children }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }}>
    <Container px={{ base: 4, md: 6, lg: 8 }} maxWidth="1440px">
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(4, minmax(0, 1fr))'
        }}
        columnGap={{ base: 4, lg: 6 }}
        rowGap="4"
        justifyItems={{ base: 'center', md: 'stretch' }}
      >
        {children}
      </Grid>
    </Container>
  </Box>
)
