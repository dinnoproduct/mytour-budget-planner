import { Box, type BoxProps } from '@chakra-ui/react'
import { type ReactNode, useMemo } from 'react'
import { OffersSection } from './OffersSection.tsx'
import { usePackageList, usePackagesSearchContext } from '@entities/package'

export const HotOffersSection = (props: BoxProps) => {
  const { handleSearch } = usePackagesSearchContext()
  const { data: packages = [], isLoading: isLoadingPackages } = usePackageList()

  const hotOfferPackages = useMemo(() => {
    const hotOffers = packages.filter(pkg => pkg.hotOffer)

    if (hotOffers.length < 4) {
      const nonHotOffers = packages.filter(pkg => !pkg.hotOffer)

      return [
        ...hotOffers,
        ...nonHotOffers.slice(0, 4 - hotOffers.length)
      ].slice(0, 4)
    }

    return hotOffers.slice(0, 4)
  }, [packages])

  const handleMoreClick = () => {
    if (packages.length === 0) {
      return
    }

    const defaultPackage = packages[0]

    handleSearch({
      fromDate: new Date(defaultPackage.destinationFlight.departureDate),
      toDate: new Date(defaultPackage.returnFlight.arrivalDate),
      travelersData: {
        adultsCount: defaultPackage.adultTravelers,
        childrenCount: 0,
        childrenAges: []
      },
      selectedCity: defaultPackage.city.id
    })
  }

  return (
    <Layout {...props}>
      <OffersSection
        packages={hotOfferPackages}
        isLoading={isLoadingPackages}
        onMoreClick={handleMoreClick}
      />
    </Layout>
  )
}

const Layout = ({
  children,
  ...props
}: { children: ReactNode | ReactNode[] } & BoxProps) => (
  <Box px={{ base: 4, md: 6 }} {...props}>
    <Box maxWidth="1376px" mx="auto">
      <Box>{children}</Box>
    </Box>
  </Box>
)
