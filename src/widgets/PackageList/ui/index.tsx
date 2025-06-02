import { type LayoutProps } from './types'
import { Box, Container, VStack } from '@chakra-ui/react'
import {
  PackageCardSkeleton,
  type PackageEntity,
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import { PackageCardHorizontal } from '@features/PackageCard'
import { useMemo } from 'react'
import { useQueryParams } from '@/hooks/useQueryParams.ts'
import { EmptyView } from '@widgets/PackageList/ui/EmptyView.tsx'
import moment from 'moment/moment'
import { getHotelNightsByDate, getNightsByDate } from '@/features/helper'

export const PackageList = () => {
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
    searchData: packagesSearchData,
    isSearchError,
    isAllowedSearchRoute: isPackagesSearchView
  } = usePackagesSearchContext()

  const {
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isAllowedSearchRoute: isHotelSearchView,
    searchData: hotelSearchData
  } = useHotelPackagesSearchContext()

  const generateLink = (tourPackage: PackageEntity) => {
    const childrenTravelers =
      tourPackage.childrenTravelers + tourPackage.infantTravelers
    let pagePath = 'hotel'

    const queryParams: any = {
      city: tourPackage.city.id.toString(),
      adultsCount: tourPackage.adultTravelers.toString(),
      childrenCount: childrenTravelers.toString(),
      hotelId: tourPackage.hotel.id.toString(),
      roomId: tourPackage.roomType.toString()
    }

    if (isPackagesSearchView) {
      queryParams.departureFlightId =
        tourPackage.destinationFlight.id.toString()
      queryParams.returnFlightId = tourPackage.returnFlight.id.toString()
      queryParams.childrenAges =
        packagesSearchData.travelersData.childrenAges.join(',')
      pagePath = 'package'
    } else {
      queryParams.childrenAges =
        hotelSearchData.travelersData.childrenAges.join(',')
      queryParams.from = moment(tourPackage.checkin).format('YYYY-MM-DD')
      queryParams.to = moment(tourPackage.checkout).format('YYYY-MM-DD')
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
  if (!isLoadingPackages && !activePackages?.length) {
    return (
      <EmptyView searchView={isPackagesSearchView ? 'packages' : 'hotel'} />
    )
  }

  const getNights = () => {
    if (searchParams.from === null || searchParams.to === null) {
      return 0
    }

    if (searchParams.nights) {
      return Number(searchParams.nights)
    }

    const fromDate = new Date(searchParams.from as string)
    const toDate = new Date(searchParams.to as string)

    return isHotelSearchView
      ? getHotelNightsByDate(fromDate, toDate)
      : getNightsByDate(fromDate, toDate)
  }

  return (
    <Layout>
      {isLoadingPackages ? <SkeletonLoading /> : null}
      {/* TODO add <PackageFilter onChange={filterParamsHandler}> */}
      {!isLoadingPackages &&
        activePackages?.map(packageEntity => (
          <PackageCardHorizontal
            tourPackage={packageEntity}
            key={packageEntity.offerId}
            link={generateLink(packageEntity)}
            nights={getNights()}
          />
        ))}
    </Layout>
  )
}

const SkeletonLoading = ({ carsCount = 8 }) =>
  Array(carsCount)
    .fill(1)
    .map((_data, index) => (
      <PackageCardSkeleton key={`package-card-skeleton-${index}`} />
    ))

const Layout = ({ children }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }}>
    <Container px={{ base: 4, md: 6, lg: 8 }} maxWidth="1440px">
      <VStack spacing={4}>
        {/* <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(4, minmax(0, 1fr))'
          }}
          columnGap={{ base: 4, lg: 6 }}
          rowGap="4"
          justifyItems={{ base: 'center', md: 'stretch' }}
        > */}
        {children}
        {/* </Grid> */}
      </VStack>
    </Container>
  </Box>
)
